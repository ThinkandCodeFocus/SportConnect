"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Globe,
  Trophy,
  Briefcase,
  Play,
  Award,
  Send,
  CornerDownRight,
  X,
  Check,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"

interface Comment {
  id: number
  author: {
    name: string
    role: string
    avatar: string
  }
  content: string
  timeAgo: string
  likes: number
  isLiked: boolean
  replies: Comment[]
}

export interface PostData {
  id: number
  author: {
    name: string
    role: string
    avatar: string
    isVerified?: boolean
    clubLogo?: string
  }
  content: string
  type: "text" | "image" | "video" | "performance" | "job" | "article"
  media?: {
    url: string
    type: "image" | "video"
  }
  performance?: {
    match: string
    stats: { label: string; value: string }[]
    result?: string
  }
  job?: {
    title: string
    club: string
    location: string
    level: string
    salary?: string
  }
  likes: number
  comments: number
  shares: number
  timeAgo: string
  isLiked?: boolean
  isSaved?: boolean
}

interface PostCardProps {
  post: PostData
}

const initialComments: Comment[] = [
  {
    id: 1,
    author: {
      name: "Antoine Griezmann",
      role: "Attaquant • Atlético Madrid",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    },
    content: "Bravo pour cette performance ! Continue comme ça 💪",
    timeAgo: "Il y a 1h",
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: 11,
        author: {
          name: "Karim Benzema",
          role: "Attaquant • Al-Ittihad",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        content: "Tout à fait d'accord avec Antoine !",
        timeAgo: "Il y a 45min",
        likes: 8,
        isLiked: false,
        replies: [],
      },
    ],
  },
  {
    id: 2,
    author: {
      name: "Didier Deschamps",
      role: "Entraîneur • Équipe de France",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    content: "Excellent travail d'équipe, c'est ce qu'on attend de nos joueurs.",
    timeAgo: "Il y a 30min",
    likes: 56,
    isLiked: true,
    replies: [],
  },
]

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isSaved, setIsSaved] = useState(post.isSaved || false)
  const [likes, setLikes] = useState(post.likes)
  const [showFullContent, setShowFullContent] = useState(false)
  
  // Comment system state
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [commentCount, setCommentCount] = useState(post.comments)
  
  // Application dialog state
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [applicationData, setApplicationData] = useState({
    motivation: "",
    experience: "",
    availability: "",
    salary: "",
  })

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    const comment: Comment = {
      id: Date.now(),
      author: {
        name: "Karim Mbappé",
        role: "Attaquant • Paris Saint-Germain",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      content: newComment,
      timeAgo: "À l'instant",
      likes: 0,
      isLiked: false,
      replies: [],
    }
    setComments([comment, ...comments])
    setNewComment("")
    setCommentCount(commentCount + 1)
  }

  const handleLikeComment = (commentId: number, isReply: boolean = false, parentId?: number) => {
    setComments(comments.map(comment => {
      if (isReply && parentId) {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                : reply
            )
          }
        }
        return comment
      }
      if (comment.id === commentId) {
        return { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
      }
      return comment
    }))
  }

  const handleReply = (commentId: number) => {
    if (!replyContent.trim()) return
    const reply: Comment = {
      id: Date.now(),
      author: {
        name: "Karim Mbappé",
        role: "Attaquant • Paris Saint-Germain",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      content: replyContent,
      timeAgo: "À l'instant",
      likes: 0,
      isLiked: false,
      replies: [],
    }
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ))
    setReplyContent("")
    setReplyingTo(null)
    setCommentCount(commentCount + 1)
  }

  const handleApply = () => {
    if (!applicationData.motivation.trim()) return
    setHasApplied(true)
    setShowApplyDialog(false)
    setApplicationData({ motivation: "", experience: "", availability: "", salary: "" })
  }

  const contentPreviewLength = 280
  const shouldTruncate = post.content.length > contentPreviewLength

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${post.id}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Link href={`/profile/${post.id}`} className="font-semibold text-foreground hover:underline hover:text-primary">
                  {post.author.name}
                </Link>
                {post.author.isVerified && (
                  <Award className="h-4 w-4 text-primary fill-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{post.author.role}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{post.timeAgo}</span>
                <span>•</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Enregistrer</DropdownMenuItem>
              <DropdownMenuItem>Copier le lien</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ne plus suivre</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Signaler</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="mt-3">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {shouldTruncate && !showFullContent
              ? `${post.content.substring(0, contentPreviewLength)}...`
              : post.content}
          </p>
          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-muted-foreground hover:text-primary text-sm font-medium mt-1"
            >
              {showFullContent ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>

        {/* Performance Stats */}
        {post.type === "performance" && post.performance && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-foreground">{post.performance.match}</span>
              {post.performance.result && (
                <Badge className="bg-primary/10 text-primary">{post.performance.result}</Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {post.performance.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Posting */}
        {post.type === "job" && post.job && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-orange-600" />
              <Badge variant="secondary">Offre de recrutement</Badge>
            </div>
            <h4 className="font-semibold text-lg text-foreground">{post.job.title}</h4>
            <p className="text-muted-foreground">{post.job.club} • {post.job.location}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{post.job.level}</Badge>
              {post.job.salary && <Badge variant="outline">{post.job.salary}</Badge>}
            </div>
            {hasApplied ? (
              <div className="mt-3 flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium">Candidature envoyée</span>
              </div>
            ) : (
              <Button className="mt-3 w-full" onClick={() => setShowApplyDialog(true)}>
                Postuler
              </Button>
            )}
          </div>
        )}

        {/* Media */}
        {post.media && (
          <div className="mt-4 -mx-4 relative">
            {post.media.type === "image" ? (
              <Image
                src={post.media.url || "/placeholder.svg"}
                alt="Post media"
                width={600}
                height={400}
                className="w-full object-cover max-h-96"
              />
            ) : (
              <div className="relative aspect-video bg-secondary">
                <Image
                  src={post.media.url || "/placeholder.svg"}
                  alt="Video thumbnail"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                  <div className="w-16 h-16 rounded-full bg-card/90 flex items-center justify-center">
                    <Play className="h-8 w-8 text-primary fill-primary ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between mt-4 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <ThumbsUp className="h-2.5 w-2.5 text-primary-foreground fill-primary-foreground" />
              </span>
            </div>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setShowComments(!showComments)} className="hover:text-primary hover:underline">
              {commentCount} commentaires
            </button>
            <span>{post.shares} partages</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 gap-2 ${isLiked ? "text-primary" : "text-muted-foreground"}`}
            onClick={handleLike}
          >
            <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-primary" : ""}`} />
            <span className="hidden sm:inline">J&apos;aime</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-1 gap-2 ${showComments ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className={`h-5 w-5 ${showComments ? "fill-primary" : ""}`} />
            <span className="hidden sm:inline">Commenter</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground">
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">Partager</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 ${isSaved ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Add Comment */}
            <div className="flex gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>KM</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input 
                  placeholder="Écrire un commentaire..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{comment.author.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-secondary rounded-lg p-3">
                        <p className="font-semibold text-sm text-foreground">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.author.role}</p>
                        <p className="mt-1 text-sm text-foreground">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs">
                        <button 
                          type="button"
                          onClick={() => handleLikeComment(comment.id)} 
                          className={`font-medium hover:underline ${comment.isLiked ? "text-primary" : "text-muted-foreground"}`}
                        >
                          J&apos;aime {comment.likes > 0 && `(${comment.likes})`}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} 
                          className="text-muted-foreground font-medium hover:underline"
                        >
                          Répondre
                        </button>
                        <span className="text-muted-foreground">{comment.timeAgo}</span>
                      </div>

                      {/* Reply Input */}
                      {replyingTo === comment.id && (
                        <div className="flex gap-2 mt-2">
                          <Input 
                            placeholder="Écrire une réponse..." 
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleReply(comment.id)}
                            className="flex-1 text-sm"
                          />
                          <Button size="sm" onClick={() => handleReply(comment.id)} disabled={!replyContent.trim()}>
                            <Send className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-12 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <CornerDownRight className="h-4 w-4 text-muted-foreground mt-2" />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{reply.author.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-secondary rounded-lg p-3">
                              <p className="font-semibold text-sm text-foreground">{reply.author.name}</p>
                              <p className="text-xs text-muted-foreground">{reply.author.role}</p>
                              <p className="mt-1 text-sm text-foreground">{reply.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs">
                              <button 
                                type="button"
                                onClick={() => handleLikeComment(reply.id, true, comment.id)} 
                                className={`font-medium hover:underline ${reply.isLiked ? "text-primary" : "text-muted-foreground"}`}
                              >
                                J&apos;aime {reply.likes > 0 && `(${reply.likes})`}
                              </button>
                              <span className="text-muted-foreground">{reply.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Dialog */}
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Postuler à cette offre</DialogTitle>
              <DialogDescription>
                {post.job && `${post.job.title} - ${post.job.club}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="motivation">Motivation *</Label>
                <Textarea 
                  id="motivation" 
                  placeholder="Pourquoi souhaitez-vous rejoindre ce club ?"
                  value={applicationData.motivation}
                  onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                  className="min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Expérience pertinente</Label>
                <Textarea 
                  id="experience" 
                  placeholder="Décrivez votre parcours et vos réalisations..."
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                  className="min-h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilité</Label>
                  <Input 
                    id="availability" 
                    placeholder="Ex: Immédiate"
                    value={applicationData.availability}
                    onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Prétentions salariales</Label>
                  <Input 
                    id="salary" 
                    placeholder="Ex: 50-60k€/an"
                    value={applicationData.salary}
                    onChange={(e) => setApplicationData({...applicationData, salary: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleApply} disabled={!applicationData.motivation.trim()}>
                Envoyer ma candidature
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
