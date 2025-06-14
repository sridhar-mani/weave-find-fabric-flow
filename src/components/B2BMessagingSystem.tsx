import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Send,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Smile,
  MoreHorizontal,
  Archive,
  Flag,
  Trash2,
  Copy,
  Download,
  ChevronDown,
  Calendar,
  Clock,
  Search,
  ChevronRight,
  Building2,
  User,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Types
export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "buyer" | "supplier" | "agent";
  company: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  type: "document" | "image" | "spreadsheet";
  name: string;
  size: string;
  url: string;
  preview?: string;
  uploadDate: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
  replyTo?: string;
}

export interface Conversation {
  id: string;
  title: string;
  participants: Participant[];
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  isStarred?: boolean;
  isArchived?: boolean;
  relatedTo?: {
    type: "order" | "quote" | "sample" | "payment" | "other";
    id: string;
    reference: string;
  };
  messages: Message[];
}

interface B2BMessagingSystemProps {
  conversations: Conversation[];
  activeUser: Participant;
  onSendMessage?: (
    conversationId: string,
    message: string,
    attachments?: File[]
  ) => void;
  onCreateConversation?: (
    participants: string[],
    title: string,
    initialMessage: string
  ) => void;
  onArchiveConversation?: (conversationId: string) => void;
}

const B2BMessagingSystem: React.FC<B2BMessagingSystemProps> = ({
  conversations,
  activeUser,
  onSendMessage,
  onCreateConversation,
  onArchiveConversation,
}) => {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Scroll to bottom of messages when conversation changes or new message added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get filtered conversations
  const getFilteredConversations = () => {
    return conversations.filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.participants.some((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        conversation.messages.some((m) =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  };

  // Function to handle message send
  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    // Call the prop callback
    onSendMessage?.(selectedConversation.id, newMessage, attachments);

    // In a real app, this would be handled by the callback response
    // For demo purposes, we'll just clear the form
    setNewMessage("");
    setAttachments([]);

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  // Function to handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowContactInfo(false);
  };

  // Function to get the other participant (in 1:1 conversations)
  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p.id !== activeUser.id);
  };

  // Find participant by ID
  const findParticipant = (id: string): Participant | undefined => {
    if (!selectedConversation) return undefined;
    return selectedConversation.participants.find((p) => p.id === id);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] border rounded-md overflow-hidden">
      {/* Conversation List */}
      <div className="w-full max-w-sm border-r bg-slate-50 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Messages
          </h2>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {getFilteredConversations().length === 0 ? (
            <div className="p-4 text-center text-slate-500 italic">
              No conversations found
            </div>
          ) : (
            getFilteredConversations().map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const lastMessage =
                conversation.messages[conversation.messages.length - 1];
              return (
                <div
                  key={conversation.id}
                  className={`p-3 border-b cursor-pointer hover:bg-slate-100 transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-slate-100"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage
                        src={otherParticipant?.avatar}
                        alt={otherParticipant?.name}
                      />
                      <AvatarFallback>
                        {otherParticipant
                          ? getInitials(otherParticipant.name)
                          : "GC"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">
                          {conversation.title}
                        </h3>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {formatDistanceToNow(
                            parseISO(conversation.lastMessageAt),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                      {otherParticipant && (
                        <div className="text-xs text-slate-500 flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          {otherParticipant.company}
                        </div>
                      )}
                      {lastMessage && (
                        <p className="text-sm truncate text-slate-600 mt-1">
                          {findParticipant(lastMessage.senderId)?.name.split(
                            " "
                          )[0] || "Unknown"}
                          : {lastMessage.content}
                        </p>
                      )}
                      {conversation.unreadCount > 0 && (
                        <div className="flex items-center justify-between mt-1">
                          <Badge className="bg-primary hover:bg-primary">
                            {conversation.unreadCount} new
                          </Badge>
                          {conversation.relatedTo && (
                            <Badge variant="outline" className="text-xs">
                              {conversation.relatedTo.type}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Message Display and Input */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden mr-2"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={getOtherParticipant(selectedConversation)?.avatar}
                    alt={getOtherParticipant(selectedConversation)?.name}
                  />
                  <AvatarFallback>
                    {getOtherParticipant(selectedConversation)
                      ? getInitials(
                          getOtherParticipant(selectedConversation)!.name
                        )
                      : "GC"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversation.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center">
                    {selectedConversation.participants.length > 2 ? (
                      <span>
                        {selectedConversation.participants.length} participants
                      </span>
                    ) : (
                      getOtherParticipant(selectedConversation) && (
                        <>
                          <Building2 className="h-3 w-3 mr-1" />
                          {getOtherParticipant(selectedConversation)!.company}
                        </>
                      )
                    )}
                    {selectedConversation.relatedTo && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="capitalize">
                          {selectedConversation.relatedTo.type}:{" "}
                          {selectedConversation.relatedTo.reference}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactInfo(!showContactInfo)}
                >
                  <User className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report Issue
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 flex">
              <div
                className={`flex-1 flex flex-col ${
                  showContactInfo ? "border-r" : ""
                }`}
              >
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => {
                    const sender = findParticipant(message.senderId);
                    const isCurrentUser = message.senderId === activeUser.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex gap-2 max-w-[80%]">
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarImage
                                src={sender?.avatar}
                                alt={sender?.name}
                              />
                              <AvatarFallback>
                                {sender ? getInitials(sender.name) : "?"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div className="flex items-baseline gap-2">
                              {!isCurrentUser && (
                                <span className="font-medium text-sm">
                                  {sender?.name}
                                </span>
                              )}
                              <span className="text-xs text-slate-500">
                                {format(parseISO(message.timestamp), "h:mm a")}
                              </span>
                            </div>
                            <div
                              className={`mt-1 p-3 rounded-md ${
                                isCurrentUser
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-slate-100"
                              }`}
                            >
                              <p className="whitespace-pre-line">
                                {message.content}
                              </p>
                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {message.attachments.map((attachment) => (
                                      <div
                                        key={attachment.id}
                                        className={`p-2 rounded flex items-center gap-2 ${
                                          isCurrentUser
                                            ? "bg-primary-foreground/10"
                                            : "bg-white"
                                        }`}
                                      >
                                        {attachment.type === "document" ? (
                                          <FileText className="h-4 w-4" />
                                        ) : attachment.type === "image" ? (
                                          <ImageIcon className="h-4 w-4" />
                                        ) : (
                                          <FileText className="h-4 w-4" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium truncate">
                                            {attachment.name}
                                          </div>
                                          <div className="text-xs">
                                            {attachment.size}
                                          </div>
                                        </div>
                                        <Button
                                          variant={
                                            isCurrentUser
                                              ? "secondary"
                                              : "outline"
                                          }
                                          size="sm"
                                          className="h-7 px-2"
                                        >
                                          <Download className="h-3 w-3 mr-1" />
                                          <span className="text-xs">
                                            Download
                                          </span>
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>

                <div className="border-t p-3 space-y-3">
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {Array.from(attachments).map((file, index) => (
                        <div
                          key={index}
                          className="p-2 rounded bg-slate-50 flex items-center gap-2"
                        >
                          {file.type.includes("image") ? (
                            <ImageIcon className="h-4 w-4 text-slate-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-slate-500" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {file.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={() => {
                              setAttachments(
                                attachments.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-slate-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="flex-1 min-h-[5rem] max-h-32"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <Paperclip className="h-4 w-4 mr-1" />
                        Attach
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="start">
                          <div className="text-center p-4">
                            Emoji selector placeholder
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contact Info Sidebar */}
              {showContactInfo && (
                <div className="w-full max-w-xs p-4 overflow-y-auto bg-slate-50">
                  <h3 className="font-medium mb-3">Contact Information</h3>
                  {getOtherParticipant(selectedConversation) && (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage
                            src={
                              getOtherParticipant(selectedConversation)?.avatar
                            }
                            alt={
                              getOtherParticipant(selectedConversation)?.name
                            }
                          />
                          <AvatarFallback className="text-lg">
                            {getInitials(
                              getOtherParticipant(selectedConversation)!.name
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="font-medium">
                          {getOtherParticipant(selectedConversation)!.name}
                        </h4>
                        <div className="text-sm text-slate-500">
                          {getOtherParticipant(selectedConversation)!
                            .role.charAt(0)
                            .toUpperCase() +
                            getOtherParticipant(
                              selectedConversation
                            )!.role.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-slate-400 mt-1" />
                          <div>
                            <div className="text-xs text-slate-500">
                              Company
                            </div>
                            <div>
                              {
                                getOtherParticipant(selectedConversation)!
                                  .company
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Mail className="h-4 w-4 text-slate-400 mt-1" />
                          <div>
                            <div className="text-xs text-slate-500">Email</div>
                            <div>
                              {getOtherParticipant(selectedConversation)!.email}
                            </div>
                          </div>
                        </div>
                        {getOtherParticipant(selectedConversation)!.phone && (
                          <div className="flex items-start gap-2 text-sm">
                            <Phone className="h-4 w-4 text-slate-400 mt-1" />
                            <div>
                              <div className="text-xs text-slate-500">
                                Phone
                              </div>
                              <div>
                                {
                                  getOtherParticipant(selectedConversation)!
                                    .phone
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {selectedConversation.relatedTo && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Related To</h4>
                          <div className="p-3 rounded border bg-white">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="capitalize">
                                {selectedConversation.relatedTo.type}
                              </Badge>
                              <Button variant="ghost" size="sm" asChild>
                                <Link
                                  to={`/${selectedConversation.relatedTo.type}s/${selectedConversation.relatedTo.id}`}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  <span className="text-xs">View</span>
                                </Link>
                              </Button>
                            </div>
                            <div className="mt-2 text-sm font-medium">
                              {selectedConversation.relatedTo.reference}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">
                          Conversation Info
                        </h4>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Started</span>
                            <span>
                              {format(
                                parseISO(selectedConversation.createdAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Messages</span>
                            <span>{selectedConversation.messages.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Participants</span>
                            <span>
                              {selectedConversation.participants.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Conversation
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Export Messages
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <p className="text-slate-500 mt-1">
                Select a conversation from the list to view messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Link = ({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
};

export default B2BMessagingSystem;
