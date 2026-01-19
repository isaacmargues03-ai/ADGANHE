import { PlaceHolderImages } from "./placeholder-images";

const betEasyAdImage = PlaceHolderImages.find(p => p.id === 'ad-banner-beteasy');
const sportifyAdImage = PlaceHolderImages.find(p => p.id === 'ad-banner-sportify');

export const dashboardStats = [
  {
    title: "Anúncios Vistos Hoje",
    value: "12",
    icon: "clapperboard",
    change: "+5 desde ontem",
  },
  {
    title: "Ganhos Totais",
    value: "R$ 142,25",
    icon: "award",
    change: "+R$ 6,00 hoje",
  },
  {
    title: "Campanhas Ativas",
    value: "2",
    icon: "trending-up",
    change: "BetEasy, Sportify+",
  },
];

export const transactionHistory = [
  {
    id: 'txn1',
    description: 'Recompensa BetEasy',
    amount: '+ R$ 0,50',
    date: '20/05/2024',
  },
  {
    id: 'txn2',
    description: 'Saque',
    amount: '- R$ 50,00',
    date: '19/05/2024',
  },
  {
    id: 'txn3',
    description: 'Recompensa de anúncio',
    amount: '+ R$ 0,75',
    date: '18/05/2024',
  },
  {
    id: 'txn4',
    description: 'Recompensa de anúncio',
    amount: '+ R$ 1,25',
    date: '17/05/2024',
  }
];

export const rewardedAds = [
  {
    title: "Bônus BetEasy: Interaja e Ganhe",
    reward: 0.50,
    duration: 20,
    imageUrl: betEasyAdImage?.imageUrl ?? "https://picsum.photos/seed/beteasy/600/400",
    imageHint: "sports betting"
  },
  {
    title: "Sportify+: Ouça sem limites",
    reward: 0.75,
    duration: 30,
    imageUrl: sportifyAdImage?.imageUrl ?? "https://picsum.photos/seed/sportify/600/400",
    imageHint: "music streaming"
  }
];
