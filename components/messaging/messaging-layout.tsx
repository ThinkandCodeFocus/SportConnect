"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api/endpoints";
import { Message, User } from "@/lib/types/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, Send, ChevronLeft, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Conversation {
  user: User;
  lastMessage: Message | null;
  unreadCount: number;
}

export function MessagingLayout() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoadingConversations(true);
    setError("");
    
    try {
      const response = await api.message.getConversations();
      const conversationsMap = new Map<number, Conversation>();

      // Group messages by conversation partner
      response.data.forEach((msg: Message) => {
        const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        const partner = msg.senderId === user.id ? msg.receiver! : msg.sender!;
        
        if (!conversationsMap.has(partnerId)) {
          conversationsMap.set(partnerId, {
            user: partner,
            lastMessage: msg,
            unreadCount: msg.receiverId === user.id && !msg.isRead ? 1 : 0,
          });
        } else {
          const conv = conversationsMap.get(partnerId)!;
          if (msg.receiverId === user.id && !msg.isRead) {
            conv.unreadCount++;
          }
          // Update last message if this one is more recent
          if (!conv.lastMessage || new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
            conv.lastMessage = msg;
          }
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (err: any) {
      console.error("Failed to load conversations:", err);
      setError(err.message || "Échec du chargement des conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (receiverId: number) => {
    if (!user) return;
    
    setIsLoadingMessages(true);
    setError("");
    
    try {
      const response = await api.message.getMessages(receiverId);
      setMessages(response.data);
      
      // Mark messages as read
      const unreadMessages = response.data.filter(
        (msg: Message) => msg.receiverId === user.id && !msg.isRead
      );
      
      for (const msg of unreadMessages) {
        try {
          await api.message.markAsRead(msg.id);
        } catch (err) {
          console.error("Failed to mark message as read:", err);
        }
      }
      
      // Refresh conversations to update unread count
      loadConversations();
    } catch (err: any) {
      console.error("Failed to load messages:", err);
      setError(err.message || "Échec du chargement des messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;
    
    setIsSending(true);
    
    try {
      const response = await api.message.send({
        receiverId: selectedConversation.id,
        content: newMessage.trim(),
      });
      
      setMessages([...messages, response.data]);
      setNewMessage("");
      
      // Refresh conversations to update last message
      loadConversations();
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError(err.message || "Échec de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    `${conv.user.firstName} ${conv.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <Card className="lg:col-span-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {isLoadingConversations ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? "Aucune conversation trouvée" : "Aucune conversation"}
            </div>
          ) : (
            <div>
              {filteredConversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => setSelectedConversation(conv.user)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b ${
                    selectedConversation?.id === conv.user.id ? "bg-accent" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={conv.user.profile?.photoUrl || undefined} />
                    <AvatarFallback>
                      {conv.user.firstName[0]}{conv.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">
                        {conv.user.firstName} {conv.user.lastName}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage?.content || "Aucun message"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="ml-2 min-w-5 h-5 flex items-center justify-center px-1">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Messages Area */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Avatar>
                  <AvatarImage src={selectedConversation.profile?.photoUrl || undefined} />
                  <AvatarFallback>
                    {selectedConversation.firstName[0]}{selectedConversation.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium">
                    {selectedConversation.firstName} {selectedConversation.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.profile?.position || selectedConversation.role}
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {isLoadingMessages ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p>Aucun message pour le moment</p>
                  <p className="text-sm mt-2">Envoyez le premier message !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isSentByMe = message.senderId === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isSentByMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isSentByMe ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}
                          >
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              {error && (
                <Alert variant="destructive" className="mb-3">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="min-h-[60px] max-h-[120px] resize-none"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Sélectionnez une conversation</p>
              <p className="text-sm">Choisissez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
