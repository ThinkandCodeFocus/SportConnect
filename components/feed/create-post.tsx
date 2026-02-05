"use client"

import { useState } from "react"
import {
  ImageIcon,
  Video,
  Trophy,
  BarChart3,
  Briefcase,
  FileText,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PostData } from "./post-card"

const postTypes = [
  { id: "photo", icon: ImageIcon, label: "Photo", color: "text-blue-600" },
  { id: "video", icon: Video, label: "Vidéo", color: "text-green-600" },
  { id: "performance", icon: Trophy, label: "Performance", color: "text-yellow-600" },
  { id: "stats", icon: BarChart3, label: "Stats", color: "text-primary" },
  { id: "job", icon: Briefcase, label: "Offre", color: "text-orange-600" },
  { id: "article", icon: FileText, label: "Article", color: "text-red-600" },
]

interface CreatePostProps {
  onPostCreated: (post: PostData) => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [selectedTab, setSelectedTab] = useState("post")
  
  // Performance form state
  const [matchName, setMatchName] = useState("")
  const [matchResult, setMatchResult] = useState("")
  const [goals, setGoals] = useState("")
  const [assists, setAssists] = useState("")
  const [rating, setRating] = useState("")
  
  // Job form state
  const [jobTitle, setJobTitle] = useState("")
  const [jobLocation, setJobLocation] = useState("")
  const [jobLevel, setJobLevel] = useState("")
  const [jobSalary, setJobSalary] = useState("")
  const [jobDescription, setJobDescription] = useState("")

  const resetForm = () => {
    setContent("")
    setMatchName("")
    setMatchResult("")
    setGoals("")
    setAssists("")
    setRating("")
    setJobTitle("")
    setJobLocation("")
    setJobLevel("")
    setJobSalary("")
    setJobDescription("")
  }

  const handlePublishPost = () => {
    if (!content.trim()) return
    
    const newPost: PostData = {
      id: Date.now(),
      author: {
        name: "Karim Mbappé",
        role: "Attaquant • Paris Saint-Germain",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: false,
      },
      content: content,
      type: "text",
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: "À l'instant",
    }
    
    onPostCreated(newPost)
    resetForm()
    setIsOpen(false)
  }

  const handlePublishPerformance = () => {
    if (!matchName.trim() || !matchResult.trim()) return
    
    const stats = []
    if (goals) stats.push({ label: "Buts", value: goals })
    if (assists) stats.push({ label: "Passes décisives", value: assists })
    if (rating) stats.push({ label: "Note", value: rating })
    
    const newPost: PostData = {
      id: Date.now(),
      author: {
        name: "Karim Mbappé",
        role: "Attaquant • Paris Saint-Germain",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: false,
      },
      content: content || `Performance du match ${matchName}`,
      type: "performance",
      performance: {
        match: matchName,
        result: matchResult,
        stats: stats.length > 0 ? stats : [{ label: "Match joué", value: "Oui" }],
      },
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: "À l'instant",
    }
    
    onPostCreated(newPost)
    resetForm()
    setIsOpen(false)
  }

  const handlePublishJob = () => {
    if (!jobTitle.trim()) return
    
    const newPost: PostData = {
      id: Date.now(),
      author: {
        name: "Karim Mbappé",
        role: "Attaquant • Paris Saint-Germain",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: false,
      },
      content: jobDescription || `Nouvelle offre : ${jobTitle}`,
      type: "job",
      job: {
        title: jobTitle,
        club: "Mon organisation",
        location: jobLocation || "France",
        level: jobLevel || "Professionnel",
        salary: jobSalary || "Selon profil",
      },
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: "À l'instant",
    }
    
    onPostCreated(newPost)
    resetForm()
    setIsOpen(false)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback>KM</AvatarFallback>
          </Avatar>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex-1 text-left px-4 py-3 rounded-full border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors text-sm"
              >
                Partagez une actualité, une performance, ou une opportunité...
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Créer une publication</DialogTitle>
              </DialogHeader>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="post">Publication</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="job">Offre</TabsTrigger>
                </TabsList>
                <TabsContent value="post" className="mt-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
                      <AvatarFallback>KM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Karim Mbappé</p>
                      <p className="text-xs text-muted-foreground">Visible par tout le monde</p>
                    </div>
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="De quoi souhaitez-vous parler ?"
                    className="mt-4 min-h-32 resize-none border-none bg-transparent text-lg focus-visible:ring-0 p-0"
                  />
                  <div className="flex items-center gap-1 mt-4 pt-4 border-t border-border">
                    {postTypes.slice(0, 4).map((type) => (
                      <Button key={type.id} variant="ghost" size="sm" className={`gap-2 ${type.color}`}>
                        <type.icon className="h-5 w-5" />
                        <span className="hidden sm:inline">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button disabled={!content.trim()} className="px-6" onClick={handlePublishPost}>
                      Publier
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="performance" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Partagez vos statistiques de match, vos records personnels ou vos accomplissements sportifs.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="matchName">Nom du match *</Label>
                        <Input 
                          id="matchName" 
                          placeholder="Ex: PSG vs OM" 
                          value={matchName}
                          onChange={(e) => setMatchName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="matchResult">Résultat *</Label>
                        <Input 
                          id="matchResult" 
                          placeholder="Ex: 3-1" 
                          value={matchResult}
                          onChange={(e) => setMatchResult(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="goals">Buts</Label>
                        <Input 
                          id="goals" 
                          placeholder="0" 
                          value={goals}
                          onChange={(e) => setGoals(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assists">Passes D.</Label>
                        <Input 
                          id="assists" 
                          placeholder="0" 
                          value={assists}
                          onChange={(e) => setAssists(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rating">Note /10</Label>
                        <Input 
                          id="rating" 
                          placeholder="8.5" 
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfContent">Commentaire (optionnel)</Label>
                      <Textarea 
                        id="perfContent"
                        placeholder="Décrivez votre performance..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-20"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        disabled={!matchName.trim() || !matchResult.trim()} 
                        className="px-6"
                        onClick={handlePublishPerformance}
                      >
                        Publier la performance
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="job" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Publiez une offre de recrutement ou un appel d&apos;offres pour votre club ou organisation.
                  </p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Titre du poste *</Label>
                        <Input 
                          id="jobTitle" 
                          placeholder="Ex: Attaquant" 
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobLocation">Localisation</Label>
                        <Input 
                          id="jobLocation" 
                          placeholder="Ex: Paris, France" 
                          value={jobLocation}
                          onChange={(e) => setJobLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobLevel">Niveau</Label>
                        <Input 
                          id="jobLevel" 
                          placeholder="Ex: Ligue 1" 
                          value={jobLevel}
                          onChange={(e) => setJobLevel(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobSalary">Salaire</Label>
                        <Input 
                          id="jobSalary" 
                          placeholder="Ex: Selon profil" 
                          value={jobSalary}
                          onChange={(e) => setJobSalary(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobDescription">Description</Label>
                      <Textarea 
                        id="jobDescription"
                        placeholder="Décrivez l'offre en détail..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-20"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        disabled={!jobTitle.trim()} 
                        className="px-6"
                        onClick={handlePublishJob}
                      >
                        Publier l&apos;offre
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          {postTypes.slice(0, 4).map((type) => (
            <Button
              key={type.id}
              variant="ghost"
              size="sm"
              className={`flex-1 gap-2 ${type.color} hover:bg-secondary`}
              onClick={() => setIsOpen(true)}
            >
              <type.icon className="h-5 w-5" />
              <span className="hidden sm:inline text-foreground">{type.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
