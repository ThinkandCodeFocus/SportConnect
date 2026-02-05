"use client"

import { useState } from "react"
import { CreatePost } from "./create-post"
import { PostCard, PostData } from "./post-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const initialFeedPosts: PostData[] = [
  {
    id: 1,
    author: {
      name: "Lucas Hernandez",
      role: "Défenseur central • AC Milan",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
    },
    content: "Très heureux d'annoncer ma prolongation avec l'AC Milan jusqu'en 2028 ! 🔴⚫ Merci à tous les supporters pour leur soutien inconditionnel. Ce club est devenu ma maison et je suis fier de continuer cette aventure ensemble. Forza Milan! 💪\n\n#ACMilan #SempreMilan #Football",
    type: "image",
    media: {
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
      type: "image",
    },
    likes: 2847,
    comments: 342,
    shares: 156,
    timeAgo: "Il y a 2h",
    isLiked: true,
  },
  {
    id: 2,
    author: {
      name: "Sophie Duval",
      role: "Agent FIFA • Paris",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
    },
    content: "Le marché des transferts hivernal s'annonce très actif cette année. Plusieurs de mes clients sont à l'écoute des opportunités en Ligue 1 et à l'étranger. N'hésitez pas à me contacter pour toute demande de renseignement.",
    type: "text",
    likes: 456,
    comments: 89,
    shares: 23,
    timeAgo: "Il y a 4h",
  },
  {
    id: 3,
    author: {
      name: "AS Monaco FC",
      role: "Club professionnel • Ligue 1",
      avatar: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
      clubLogo: "ASM",
    },
    content: "🚨 OFFRE DE RECRUTEMENT 🚨\n\nNous recherchons un milieu de terrain expérimenté pour renforcer notre effectif cette saison. Profil recherché : technique, vision de jeu et expérience au haut niveau.",
    type: "job",
    job: {
      title: "Milieu de terrain central",
      club: "AS Monaco FC",
      location: "Monaco",
      level: "Ligue 1",
      salary: "Selon profil",
    },
    likes: 1234,
    comments: 267,
    shares: 445,
    timeAgo: "Il y a 5h",
  },
  {
    id: 4,
    author: {
      name: "Thomas Müller",
      role: "Attaquant • FC Bayern München",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
    },
    content: "Super performance ce week-end contre Dortmund ! L'équipe a montré un excellent état d'esprit et nous avons su faire la différence dans les moments clés. Voici mes statistiques du match :",
    type: "performance",
    performance: {
      match: "Bayern vs Dortmund",
      result: "3-1",
      stats: [
        { label: "Buts", value: "2" },
        { label: "Passes décisives", value: "1" },
        { label: "Note", value: "9.2" },
      ],
    },
    likes: 5623,
    comments: 892,
    shares: 234,
    timeAgo: "Il y a 8h",
  },
  {
    id: 5,
    author: {
      name: "Marie Lefebvre",
      role: "Préparatrice physique • Équipe de France Handball",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    content: "Nouvelle étude publiée sur l'optimisation de la récupération post-match chez les athlètes de haut niveau. Les résultats montrent que la combinaison de cryothérapie et de massage réduit significativement les marqueurs d'inflammation.\n\nJe partagerai les protocoles détaillés lors de ma prochaine conférence à l'INSEP. Inscriptions ouvertes !",
    type: "text",
    likes: 789,
    comments: 156,
    shares: 89,
    timeAgo: "Il y a 12h",
  },
  {
    id: 6,
    author: {
      name: "Académie Jean-Marc Guillou",
      role: "Centre de formation • Côte d'Ivoire",
      avatar: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop",
      isVerified: true,
    },
    content: "Félicitations à nos U17 qui remportent le tournoi régional ! 🏆\n\n12 matchs, 12 victoires, 47 buts marqués, seulement 3 encaissés. Une génération exceptionnelle qui représente l'avenir du football africain.",
    type: "image",
    media: {
      url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
      type: "image",
    },
    likes: 2156,
    comments: 234,
    shares: 567,
    timeAgo: "Il y a 1j",
  },
  {
    id: 7,
    author: {
      name: "Pierre Gasly",
      role: "Scout professionnel • Premier League",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    content: "De retour d'une semaine de scouting au Brésil. J'ai observé plusieurs talents prometteurs dans les catégories U20 et U23. Le niveau technique reste impressionnant et certains profils correspondent parfaitement aux besoins des clubs européens.\n\nSi vous êtes recruteur et intéressé par le marché brésilien, n'hésitez pas à me contacter.",
    type: "text",
    likes: 567,
    comments: 123,
    shares: 45,
    timeAgo: "Il y a 1j",
  },
  {
    id: 8,
    author: {
      name: "Fédération Française de Basketball",
      role: "Fédération nationale • France",
      avatar: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop&crop=face",
      isVerified: true,
    },
    content: "📢 APPEL D'OFFRES - Équipementier officiel 2026-2030\n\nLa FFBB lance un appel d'offres pour la fourniture d'équipements pour l'ensemble de ses équipes nationales. Cahier des charges disponible sur notre site.",
    type: "job",
    job: {
      title: "Équipementier officiel",
      club: "FFBB",
      location: "France",
      level: "National",
    },
    likes: 890,
    comments: 67,
    shares: 234,
    timeAgo: "Il y a 2j",
  },
]

export function Feed() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [posts, setPosts] = useState<PostData[]>(initialFeedPosts)

  const handleNewPost = (newPost: PostData) => {
    setPosts((prevPosts) => [newPost, ...prevPosts])
  }

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true
    if (activeFilter === "posts") return post.type === "text" || post.type === "image"
    if (activeFilter === "jobs") return post.type === "job"
    if (activeFilter === "performances") return post.type === "performance"
    return true
  })

  return (
    <div className="flex-1 max-w-xl mx-auto lg:mx-0 space-y-4">
      <CreatePost onPostCreated={handleNewPost} />
      
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <TabsList className="w-full justify-start bg-card border border-border h-auto p-1 rounded-lg">
          <TabsTrigger value="all" className="text-sm">Tout</TabsTrigger>
          <TabsTrigger value="posts" className="text-sm">Publications</TabsTrigger>
          <TabsTrigger value="jobs" className="text-sm">Offres</TabsTrigger>
          <TabsTrigger value="performances" className="text-sm">Performances</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Aucune publication de ce type pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
