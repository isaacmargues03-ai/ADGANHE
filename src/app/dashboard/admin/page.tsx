"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, doc, updateDoc, serverTimestamp, Timestamp, where, getDocs, runTransaction, increment, getDoc } from "firebase/firestore";
import { Separator } from "@/components/ui/separator";

type WithdrawalRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  pixKey: string;
  createdAt: Timestamp;
  status: 'pending' | 'completed' | 'rejected';
};

type SearchedUser = {
    id: string;
    email: string;
    credits: number;
    score?: number;
    registrationDate?: Timestamp;
}

const ADMIN_EMAIL = "isaacmargues03@gmail.com";

export default function AdminPage() {
  const { toast } = useToast();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState<SearchedUser | null>(null);
  const [searchedUserWithdrawals, setSearchedUserWithdrawals] = useState<WithdrawalRequest[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  const [adjustmentEmail, setAdjustmentEmail] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);


  useEffect(() => {
    if (!isAuthLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.replace('/dashboard');
    }
  }, [user, isAuthLoading, router]);
  
  const handleUserSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !searchEmail) return;

    setIsSearching(true);
    setSearchedUser(null);
    setSearchedUserWithdrawals(null);
    setSearchMessage(null);

    const emailToSearch = searchEmail.trim().toLowerCase();

    try {
      const usersRef = collection(firestore, "users");
      const userQuery = query(usersRef, where("email", "==", emailToSearch));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        setSearchedUser({ id: userDoc.id, ...userDoc.data() } as SearchedUser);
      } else {
        const requestsRef = collection(firestore, "withdrawalRequests");
        const requestsQuery = query(requestsRef, where("userEmail", "==", emailToSearch));
        const requestsSnapshot = await getDocs(requestsQuery);

        if (requestsSnapshot.empty) {
          setSearchMessage("Nenhum usuário ou histórico de saques encontrado para este e-mail.");
        } else {
          const withdrawals = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
          withdrawals.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
          setSearchedUserWithdrawals(withdrawals);
          setSearchMessage(`Usuário não encontrado na base de dados principal. Exibindo histórico de saques para ${emailToSearch}:`);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setSearchMessage("Ocorreu um erro ao buscar o usuário.");
    } finally {
      setIsSearching(false);
    }
  };


  const requestsQuery = useMemoFirebase(() => {
    if (!firestore || !user || user.email !== ADMIN_EMAIL) return null;
    return query(collection(firestore, "withdrawalRequests"), orderBy("createdAt", "desc"));
  }, [firestore, user]);

  const { data: requests, isLoading: isRequestsLoading, error } = useCollection<Omit<WithdrawalRequest, 'id'>>(requestsQuery);

  if (error) {
    console.error("Error fetching withdrawal requests:", error);
  }

  const handleRequest = async (id: string, action: "approve" | "reject") => {
    if (!firestore) return;
    const request = requests?.find((r) => r.id === id);
    if (!request) return;
    
    const newStatus = action === "approve" ? "completed" : "rejected";
    const requestRef = doc(firestore, 'withdrawalRequests', id);

    try {
      await updateDoc(requestRef, {
        status: newStatus,
        processedAt: serverTimestamp()
      });

      toast({
        title: `Solicitação ${newStatus === "completed" ? "Aprovada" : "Rejeitada"}`,
        description: `O saque para ${request.userName} foi processado.`,
      });
    } catch (error) {
       console.error("Failed to update request:", error);
       toast({
           variant: "destructive",
           title: "Erro",
           description: "Não foi possível atualizar a solicitação.",
       });
    }
  };

  const handleAdjustCredits = async () => {
    if (!firestore || isAdjusting) return;

    const email = adjustmentEmail.trim().toLowerCase();
    const amount = parseFloat(adjustmentAmount);
    const reason = adjustmentReason.trim();

    if (!email) {
      toast({ variant: "destructive", title: "E-mail Inválido", description: "Por favor, insira um e-mail." });
      return;
    }
    if (isNaN(amount)) {
      toast({ variant: "destructive", title: "Valor Inválido", description: "Por favor, insira um valor numérico válido." });
      return;
    }
    if (!reason) {
      toast({ variant: "destructive", title: "Motivo Inválido", description: "Por favor, forneça um motivo para o ajuste." });
      return;
    }

    setIsAdjusting(true);

    try {
      const usersRef = collection(firestore, "users");
      const userQuery = query(usersRef, where("email", "==", email));
      const userSnapshot = await getDocs(userQuery);

      let userDocRef;
      let userId;

      if (!userSnapshot.empty) {
        // User found in 'users' collection
        const userDoc = userSnapshot.docs[0];
        userId = userDoc.id;
        userDocRef = doc(firestore, "users", userId);

        // Run transaction to update existing user
        await runTransaction(firestore, async (transaction) => {
            transaction.update(userDocRef, {
                credits: increment(amount),
                score: increment(amount)
            });
            const newTransactionRef = doc(collection(firestore, "users", userId, "transactions"));
            transaction.set(newTransactionRef, {
                description: reason,
                amount: amount,
                createdAt: serverTimestamp(),
            });
        });

      } else {
        // User NOT found in 'users', check 'withdrawalRequests'
        const requestsRef = collection(firestore, "withdrawalRequests");
        const requestsQuery = query(requestsRef, where("userEmail", "==", email));
        const requestsSnapshot = await getDocs(requestsQuery);

        if (requestsSnapshot.empty) {
            // User not found anywhere, show error
            toast({ variant: "destructive", title: "Usuário não encontrado", description: `Nenhum usuário encontrado com o e-mail ${email} na base de dados.` });
            setIsAdjusting(false);
            return;
        }

        // User found in withdrawal requests, create a new document in 'users'
        userId = requestsSnapshot.docs[0].data().userId;
        if (!userId) {
             toast({ variant: "destructive", title: "Erro de Dados", description: `Histórico de saque encontrado para ${email}, mas não contém um ID de usuário.` });
             setIsAdjusting(false);
             return;
        }
        
        userDocRef = doc(firestore, "users", userId);
        
        // Run transaction to create new user and add transaction
        await runTransaction(firestore, async (transaction) => {
            transaction.set(userDocRef, {
                id: userId,
                email: email,
                credits: amount, // Set initial credits to the adjustment amount
                score: amount,   // Set initial score to the adjustment amount
                registrationDate: serverTimestamp(),
                lastLogin: serverTimestamp(),
                username: email.split('@')[0] ?? `user_${userId.substring(0,5)}`,
            });
            const newTransactionRef = doc(collection(firestore, "users", userId, "transactions"));
            transaction.set(newTransactionRef, {
                description: reason,
                amount: amount,
                createdAt: serverTimestamp(),
            });
        });
      }

      toast({
        title: "Saldo Ajustado!",
        description: `O saldo de ${email} foi ajustado em ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}.`,
      });

      // Refresh searched user data if they are being displayed
      if (searchedUser && searchedUser.id === userId) {
        const updatedUserDoc = await getDoc(userDocRef);
        if (updatedUserDoc.exists()) {
          setSearchedUser({ id: updatedUserDoc.id, ...updatedUserDoc.data() } as SearchedUser);
        }
      }

      setAdjustmentEmail("");
      setAdjustmentAmount("");
      setAdjustmentReason("");

    } catch (error: any) {
      console.error("Erro detalhado ao ajustar saldo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Ajustar Saldo",
        description: error.message || "Não foi possível completar a operação. Verifique o console para detalhes.",
      });
    } finally {
      setIsAdjusting(false);
    }
  };


  const pendingRequests = requests?.filter(req => req.status === 'pending') ?? [];
  const processedRequests = requests?.filter(req => req.status === 'completed' || req.status === 'rejected') ?? [];
  
  if (isAuthLoading || !user || user.email !== ADMIN_EMAIL) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const dataLoading = isRequestsLoading;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel do Administrador</h1>
        <p className="text-muted-foreground">
          Gerencie saques e consulte informações dos usuários.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Contas</CardTitle>
          <CardDescription>
            Consulte ou ajuste o saldo de um usuário.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <h3 className="font-semibold mb-2 text-base">Consultar Usuário</h3>
             <form onSubmit={handleUserSearch} className="flex flex-col md:flex-row gap-2">
              <Input
                type="email"
                placeholder="Digite o e-mail para ver detalhes"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                required
                className="w-full"
              />
              <Button type="submit" disabled={isSearching} className="md:w-auto w-full shrink-0">
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Buscar"}
              </Button>
            </form>
        </CardContent>
        {searchMessage && !searchedUser && !searchedUserWithdrawals && (
          <CardFooter className="py-0">
            <p className="text-sm text-destructive">{searchMessage}</p>
          </CardFooter>
        )}
        
        <Separator className="my-4" />

        <CardHeader className="pt-0">
             <h3 className="font-semibold text-base">Adicionar Saldo Manualmente</h3>
        </CardHeader>
        <CardContent className="flex w-full flex-col gap-2">
              <Input
                  type="email"
                  placeholder="E-mail do usuário"
                  value={adjustmentEmail}
                  onChange={(e) => setAdjustmentEmail(e.target.value)}
                  disabled={isAdjusting}
              />
              <Input
                  type="number"
                  placeholder="Valor (ex: 10.50 ou -5.00)"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  disabled={isAdjusting}
              />
              <Input
                  type="text"
                  placeholder="Motivo do ajuste (ex: Bônus, Correção)"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  disabled={isAdjusting}
              />
              <Button onClick={handleAdjustCredits} disabled={isAdjusting || !adjustmentEmail || !adjustmentAmount || !adjustmentReason} className="w-full">
                  {isAdjusting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Aplicar Ajuste"}
              </Button>
        </CardContent>
      </Card>

      {searchedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Busca</CardTitle>
            <CardDescription>Detalhes da conta para {searchedUser.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Informações da Conta</h4>
              <p className="text-sm text-muted-foreground"><strong>ID:</strong> {searchedUser.id}</p>
              <p className="text-sm text-muted-foreground"><strong>Email:</strong> {searchedUser.email}</p>
              <p className="text-sm text-muted-foreground"><strong>Saldo (credits):</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(searchedUser.credits ?? 0)}</p>
              <p className="text-sm text-muted-foreground"><strong>Score:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(searchedUser.score ?? searchedUser.credits ?? 0)}</p>
              <p className="text-sm text-muted-foreground"><strong>Membro desde:</strong> {searchedUser.registrationDate?.toDate().toLocaleDateString('pt-BR') ?? 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {searchedUserWithdrawals && (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de Saques do Usuário</CardTitle>
                <CardDescription>{searchMessage}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchedUserWithdrawals.map(req => (
                        <div key={req.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                            <div>
                                <p className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.amount)}</p>
                                <p className="text-xs text-muted-foreground">{req.createdAt?.toDate().toLocaleString('pt-BR') ?? 'N/A'}</p>
                            </div>
                            <Badge variant={req.status === 'completed' ? 'outline' : req.status === 'rejected' ? 'destructive' : 'secondary'} className={`${req.status === 'completed' ? 'border-accent text-accent' : ''} shrink-0`}>
                               {req.status === 'completed' ? 'Completo' : req.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                             </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}


      <Card>
        <CardHeader>
          <CardTitle>Solicitações Pendentes</CardTitle>
          <CardDescription>
            Aprove ou rejeite as solicitações de saque pendentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="md:hidden">
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((req) => (
                      <Card key={req.id} className="pt-6">
                        <CardHeader className="py-0">
                          <CardTitle className="text-base">{req.userName}</CardTitle>
                          <CardDescription>{req.userEmail}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                          <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.amount)}</p>
                          <p><strong>Chave PIX:</strong> {req.pixKey}</p>
                          <p><strong>Data:</strong> {req.createdAt?.toDate().toLocaleDateString('pt-BR')}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-accent"
                            onClick={() => handleRequest(req.id, "approve")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprovar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleRequest(req.id, "reject")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejeitar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-muted-foreground">
                    Nenhuma solicitação pendente.
                  </p>
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Chave PIX</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <div className="font-medium">{req.userName}</div>
                            <div className="text-sm text-muted-foreground">
                              {req.userEmail}
                            </div>
                          </TableCell>
                          <TableCell>{req.pixKey}</TableCell>
                          <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.amount)}</TableCell>
                          <TableCell>{req.createdAt?.toDate().toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent"
                              onClick={() => handleRequest(req.id, "approve")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprovar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleRequest(req.id, "reject")}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Rejeitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Nenhuma solicitação pendente.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Saques</CardTitle>
           <CardDescription>
            Visualize as solicitações de saque já processadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
             <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
           <>
              {/* Mobile View */}
              <div className="md:hidden">
                {processedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {processedRequests.map((req) => (
                      <Card key={req.id} className="pt-6">
                        <CardHeader className="py-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{req.userName}</CardTitle>
                              <CardDescription>{req.userEmail}</CardDescription>
                            </div>
                             <Badge variant={req.status === 'completed' ? 'outline' : 'destructive'} className={`${req.status === 'completed' ? 'border-accent text-accent' : ''} shrink-0`}>
                               {req.status === 'completed' ? 'Completo' : 'Rejeitado'}
                             </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                           <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.amount)}</p>
                           <p><strong>Chave PIX:</strong> {req.pixKey}</p>
                           <p><strong>Data:</strong> {req.createdAt?.toDate().toLocaleDateString('pt-BR')}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                   <p className="py-8 text-center text-muted-foreground">
                    Nenhum saque processado ainda.
                   </p>
                )}
              </div>
           
              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Chave PIX</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedRequests.length > 0 ? (
                    processedRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="font-medium">{req.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {req.userEmail}
                          </div>
                        </TableCell>
                        <TableCell>{req.pixKey}</TableCell>
                        <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.amount)}</TableCell>
                        <TableCell>{req.createdAt?.toDate().toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                           <Badge variant={req.status === 'completed' ? 'outline' : 'destructive'} className={req.status === 'completed' ? 'text-accent border-accent' : ''}>
                             {req.status === 'completed' ? 'Completo' : 'Rejeitado'}
                           </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum saque processado ainda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
