"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  Edit,
  MoreHorizontal,
  Settings,
  Video,
  Phone,
  Info,
  Paperclip,
  ImageIcon,
  Send,
  Smile,
  Check,
  CheckCheck,
  ChevronLeft,
  Users,
  X,
  Archive,
  Trash2,
  BellOff,
  Pin,
  UserPlus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  isGroup?: boolean
  members?: number
}

interface Message {
  id: number
  senderId: number
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read"
}

interface ConversationMessages {
  [conversationId: number]: Message[]
}

interface Contact {
  id: number
  name: string
  avatar: string
  role: string
  online: boolean
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Sophie Martin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Je serais intéressée de discuter de cette opportunité...",
    timestamp: "14:32",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "AS Monaco - Recrutement",
    avatar: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop",
    lastMessage: "Votre profil nous intéresse. Seriez-vous disponible...",
    timestamp: "12:15",
    unread: 1,
    online: false,
  },
  {
    id: 3,
    name: "Thomas Dubois",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Merci pour les conseils sur l'entraînement !",
    timestamp: "Hier",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Staff OM",
    avatar: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop",
    lastMessage: "Marc: La séance de demain est maintenue...",
    timestamp: "Hier",
    unread: 5,
    online: false,
    isGroup: true,
    members: 8,
  },
  {
    id: 5,
    name: "Jean-Pierre Martinez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Bonne chance pour le match de ce week-end !",
    timestamp: "Lun",
    unread: 0,
    online: false,
  },
  {
    id: 6,
    name: "Marie Lefebvre",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Les résultats de vos tests sont excellents.",
    timestamp: "Dim",
    unread: 0,
    online: false,
  },
  {
    id: 7,
    name: "Agents Football FR",
    avatar: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop",
    lastMessage: "Pierre: Nouveau poste disponible en L2...",
    timestamp: "Sam",
    unread: 12,
    online: false,
    isGroup: true,
    members: 24,
  },
]

const contacts: Contact[] = [
  {
    id: 101,
    name: "Antoine Griezmann",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    role: "Attaquant - Atlético Madrid",
    online: true,
  },
  {
    id: 102,
    name: "Karim Benzema",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    role: "Attaquant - Al-Ittihad",
    online: false,
  },
  {
    id: 103,
    name: "Kylian Mbappé",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    role: "Attaquant - Real Madrid",
    online: true,
  },
  {
    id: 104,
    name: "Olivier Giroud",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
    role: "Attaquant - AC Milan",
    online: false,
  },
  {
    id: 105,
    name: "N'Golo Kanté",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    role: "Milieu - Al-Ittihad",
    online: true,
  },
]

const initialAllMessages: ConversationMessages = {
  1: [
    {
      id: 1,
      senderId: 1,
      content: "Bonjour Karim, j'ai vu votre profil et vos performances récentes. Très impressionnant !",
      timestamp: "14:20",
      status: "read",
    },
    {
      id: 2,
      senderId: 0,
      content: "Merci beaucoup Sophie ! C'est très gentil de votre part.",
      timestamp: "14:22",
      status: "read",
    },
    {
      id: 3,
      senderId: 1,
      content: "Je représente plusieurs clubs en Ligue 1 et à l'étranger. Avez-vous des projets pour la saison prochaine ?",
      timestamp: "14:25",
      status: "read",
    },
    {
      id: 4,
      senderId: 0,
      content: "Je suis ouvert aux discussions. Mon contrat actuel se termine en juin et j'explore plusieurs options.",
      timestamp: "14:28",
      status: "read",
    },
    {
      id: 5,
      senderId: 1,
      content: "Parfait ! Je serais intéressée de discuter de cette opportunité avec vous. J'ai un club en Premier League qui recherche exactement votre profil.",
      timestamp: "14:32",
      status: "delivered",
    },
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      content: "Bonjour, nous avons étudié votre parcours avec attention.",
      timestamp: "11:45",
      status: "read",
    },
    {
      id: 2,
      senderId: 2,
      content: "Votre profil nous intéresse. Seriez-vous disponible pour un entretien la semaine prochaine ?",
      timestamp: "12:15",
      status: "delivered",
    },
  ],
  3: [
    {
      id: 1,
      senderId: 0,
      content: "Salut Thomas ! Tu as des conseils pour améliorer ma condition physique ?",
      timestamp: "09:30",
      status: "read",
    },
    {
      id: 2,
      senderId: 3,
      content: "Bien sûr ! Je te recommande de travailler sur le cardio et la musculation en alternance.",
      timestamp: "10:15",
      status: "read",
    },
    {
      id: 3,
      senderId: 3,
      content: "Merci pour les conseils sur l'entraînement !",
      timestamp: "Hier",
      status: "read",
    },
  ],
  4: [
    {
      id: 1,
      senderId: 41,
      content: "Marc: Rappel - la séance de demain est à 9h au centre.",
      timestamp: "Hier 18:30",
      status: "read",
    },
    {
      id: 2,
      senderId: 42,
      content: "Pierre: OK, je serai là.",
      timestamp: "Hier 18:45",
      status: "read",
    },
    {
      id: 3,
      senderId: 43,
      content: "Marc: La séance de demain est maintenue malgré la météo.",
      timestamp: "Hier 19:00",
      status: "delivered",
    },
  ],
  5: [
    {
      id: 1,
      senderId: 5,
      content: "Félicitations pour ta performance ce week-end !",
      timestamp: "Lun 20:15",
      status: "read",
    },
    {
      id: 2,
      senderId: 5,
      content: "Bonne chance pour le match de ce week-end !",
      timestamp: "Lun 20:18",
      status: "read",
    },
  ],
  6: [
    {
      id: 1,
      senderId: 6,
      content: "Bonjour, j'ai reçu les résultats de vos derniers tests médicaux.",
      timestamp: "Dim 14:00",
      status: "read",
    },
    {
      id: 2,
      senderId: 6,
      content: "Les résultats de vos tests sont excellents. Tout est normal !",
      timestamp: "Dim 14:05",
      status: "read",
    },
  ],
  7: [
    {
      id: 1,
      senderId: 71,
      content: "Pierre: Nouveau poste disponible en L2, profil défenseur recherché.",
      timestamp: "Sam 10:30",
      status: "read",
    },
    {
      id: 2,
      senderId: 72,
      content: "Marc: Intéressé par ce profil, je le contacte.",
      timestamp: "Sam 11:00",
      status: "delivered",
    },
  ],
}

const messages: Message[] = [
  {
    id: 1,
    senderId: 1,
    content: "Bonjour Karim, j'ai vu votre profil et vos performances récentes. Très impressionnant !",
    timestamp: "14:20",
    status: "read",
  },
  {
    id: 2,
    senderId: 0,
    content: "Merci beaucoup Sophie ! C'est très gentil de votre part.",
    timestamp: "14:22",
    status: "read",
  },
  {
    id: 3,
    senderId: 1,
    content: "Je représente plusieurs clubs en Ligue 1 et à l'étranger. Avez-vous des projets pour la saison prochaine ?",
    timestamp: "14:25",
    status: "read",
  },
  {
    id: 4,
    senderId: 0,
    content: "Je suis ouvert aux discussions. Mon contrat actuel se termine en juin et j'explore plusieurs options.",
    timestamp: "14:28",
    status: "read",
  },
  {
    id: 5,
    senderId: 1,
    content: "Parfait ! Je serais intéressée de discuter de cette opportunité avec vous. J'ai un club en Premier League qui recherche exactement votre profil.",
    timestamp: "14:32",
    status: "delivered",
  },
]

export function MessagingLayout() {
  const [conversationsList, setConversationsList] = useState<Conversation[]>(conversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [allMessages, setAllMessages] = useState<ConversationMessages>(initialAllMessages)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null)
  const [mutedConversations, setMutedConversations] = useState<number[]>([])
  const [pinnedConversations, setPinnedConversations] = useState<number[]>([])
  const [archivedConversations, setArchivedConversations] = useState<number[]>([])
  const [contactSearch, setContactSearch] = useState("")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [allMessages, selectedConversation])

  const filteredConversations = conversationsList
    .filter((c) => !archivedConversations.includes(c.id))
    .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Pinned conversations first
      const aPinned = pinnedConversations.includes(a.id) ? 1 : 0
      const bPinned = pinnedConversations.includes(b.id) ? 1 : 0
      return bPinned - aPinned
    })

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  )

  const currentMessages = selectedConversation ? allMessages[selectedConversation.id] || [] : []

  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: Date.now(),
      senderId: 0,
      content: messageInput.trim(),
      timestamp: getCurrentTime(),
      status: "sent",
    }

    // Add message to conversation
    setAllMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage],
    }))

    // Update conversation's last message and move to top
    setConversationsList((prev) => {
      const updated = prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: messageInput.trim(), timestamp: getCurrentTime(), unread: 0 }
          : c
      )
      // Move the conversation to top (after pinned ones)
      const conv = updated.find((c) => c.id === selectedConversation.id)
      const others = updated.filter((c) => c.id !== selectedConversation.id)
      return conv ? [conv, ...others] : updated
    })

    setMessageInput("")

    // Simulate message delivery after 1 second
    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: (prev[selectedConversation.id] || []).map((m) =>
          m.id === newMessage.id ? { ...m, status: "delivered" } : m
        ),
      }))
    }, 1000)

    // Simulate message read after 3 seconds
    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: (prev[selectedConversation.id] || []).map((m) =>
          m.id === newMessage.id ? { ...m, status: "read" } : m
        ),
      }))
    }, 3000)
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setShowMobileChat(true)
    // Mark messages as read
    setConversationsList((prev) =>
      prev.map((c) => (c.id === conversation.id ? { ...c, unread: 0 } : c))
    )
  }

  const handleStartNewConversation = (contact: Contact) => {
    // Check if conversation already exists
    const existingConv = conversationsList.find(
      (c) => c.name === contact.name
    )

    if (existingConv) {
      setSelectedConversation(existingConv)
      setShowMobileChat(true)
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: Date.now(),
        name: contact.name,
        avatar: contact.avatar,
        lastMessage: "Nouvelle conversation",
        timestamp: getCurrentTime(),
        unread: 0,
        online: contact.online,
      }
      setConversationsList((prev) => [newConversation, ...prev])
      setAllMessages((prev) => ({
        ...prev,
        [newConversation.id]: [],
      }))
      setSelectedConversation(newConversation)
      setShowMobileChat(true)
    }
    setShowNewMessageDialog(false)
    setContactSearch("")
  }

  const handleArchiveConversation = (id: number) => {
    setArchivedConversations((prev) => [...prev, id])
    if (selectedConversation?.id === id) {
      setSelectedConversation(null)
    }
  }

  const handleDeleteConversation = () => {
    if (!conversationToDelete) return
    setConversationsList((prev) => prev.filter((c) => c.id !== conversationToDelete.id))
    setAllMessages((prev) => {
      const newMessages = { ...prev }
      delete newMessages[conversationToDelete.id]
      return newMessages
    })
    if (selectedConversation?.id === conversationToDelete.id) {
      setSelectedConversation(null)
    }
    setShowDeleteDialog(false)
    setConversationToDelete(null)
  }

  const handleToggleMute = (id: number) => {
    setMutedConversations((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    )
  }

  const handleTogglePin = (id: number) => {
    setPinnedConversations((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    )
  }

  const openDeleteDialog = (conversation: Conversation) => {
    setConversationToDelete(conversation)
    setShowDeleteDialog(true)
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full lg:w-96 border-r border-border flex flex-col ${showMobileChat ? "hidden lg:flex" : "flex"}`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Messagerie</h1>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowNewMessageDialog(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-none"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => {
              const isPinned = pinnedConversations.includes(conversation.id)
              const isMuted = mutedConversations.includes(conversation.id)
              
              return (
                <div
                  key={conversation.id}
                  className={`relative group w-full p-4 flex items-start gap-3 hover:bg-secondary transition-colors ${
                    selectedConversation?.id === conversation.id ? "bg-secondary" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectConversation(conversation)}
                    className="flex items-start gap-3 flex-1 text-left"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conversation.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                      {conversation.isGroup && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Users className="h-3 w-3 text-primary-foreground" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {isPinned && <Pin className="h-3 w-3 text-primary" />}
                          <p className={`font-medium text-sm truncate ${conversation.unread > 0 ? "text-foreground" : "text-foreground"}`}>
                            {conversation.name}
                          </p>
                          {isMuted && <BellOff className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <span className={`text-xs ${conversation.unread > 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                          {conversation.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${conversation.unread > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      {conversation.isGroup && (
                        <p className="text-xs text-muted-foreground mt-1">{conversation.members} membres</p>
                      )}
                    </div>
                  </button>
                  
                  {/* Conversation actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-3"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleTogglePin(conversation.id)}>
                        <Pin className="h-4 w-4 mr-2" />
                        {isPinned ? "Désépingler" : "Épingler"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleMute(conversation.id)}>
                        <BellOff className="h-4 w-4 mr-2" />
                        {isMuted ? "Réactiver les notifications" : "Mettre en sourdine"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchiveConversation(conversation.id)}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archiver
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(conversation)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${showMobileChat ? "flex" : "hidden lg:flex"}`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8"
                  onClick={() => setShowMobileChat(false)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedConversation.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{selectedConversation.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.online ? (
                      <span className="text-green-600">En ligne</span>
                    ) : selectedConversation.isGroup ? (
                      `${selectedConversation.members} membres`
                    ) : (
                      "Hors ligne"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTogglePin(selectedConversation.id)}>
                      {pinnedConversations.includes(selectedConversation.id) ? "Désépingler" : "Épingler"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleArchiveConversation(selectedConversation.id)}>
                      Archiver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleMute(selectedConversation.id)}>
                      {mutedConversations.includes(selectedConversation.id) ? "Réactiver les notifications" : "Mettre en sourdine"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => openDeleteDialog(selectedConversation)}
                      className="text-destructive focus:text-destructive"
                    >
                      Supprimer la conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun message. Commencez la conversation !</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        Aujourd&apos;hui
                      </span>
                    </div>
                    {currentMessages.map((message) => {
                      const isMe = message.senderId === 0
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}>
                            {!isMe && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{selectedConversation.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isMe
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-secondary text-foreground rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : ""}`}>
                                <span className={`text-xs ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                  {message.timestamp}
                                </span>
                                {isMe && (
                                  message.status === "read" ? (
                                    <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                                  ) : message.status === "delivered" ? (
                                    <CheckCheck className="h-3 w-3 text-primary-foreground/50" />
                                  ) : (
                                    <Check className="h-3 w-3 text-primary-foreground/50" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hidden sm:flex">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 relative">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Écrivez un message..."
                    className="min-h-10 max-h-32 resize-none pr-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="absolute right-1 bottom-1 h-8 w-8 text-muted-foreground">
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  className="h-10 w-10"
                  disabled={!messageInput.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Edit className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Vos messages</h3>
              <p className="text-muted-foreground mt-1">
                Sélectionnez une conversation ou démarrez-en une nouvelle
              </p>
              <Button className="mt-4" onClick={() => setShowNewMessageDialog(true)}>
                Nouveau message
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau message</DialogTitle>
            <DialogDescription>
              Recherchez un contact pour démarrer une conversation
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Command className="rounded-lg border">
              <CommandInput 
                placeholder="Rechercher un contact..." 
                value={contactSearch}
                onValueChange={setContactSearch}
              />
              <CommandList>
                <CommandEmpty>Aucun contact trouvé.</CommandEmpty>
                <CommandGroup heading="Contacts">
                  {filteredContacts.map((contact) => (
                    <CommandItem
                      key={contact.id}
                      onSelect={() => handleStartNewConversation(contact)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{contact.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                        </div>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Conversation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette conversation ?</DialogTitle>
            <DialogDescription>
              {conversationToDelete && (
                <>
                  Êtes-vous sûr de vouloir supprimer la conversation avec {conversationToDelete.name} ? 
                  Cette action est irréversible et tous les messages seront perdus.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConversation}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
