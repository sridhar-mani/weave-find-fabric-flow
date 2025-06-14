import React from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import B2BMessagingSystem, {
  Participant,
  Conversation,
} from "@/components/B2BMessagingSystem";

// Mock active user
const activeUser: Participant = {
  id: "user-1",
  name: "John Apparel Co.",
  email: "john@apparelco.com",
  role: "buyer",
  company: "John Apparel Co.",
  avatar: "",
};

// Mock conversations data
const mockConversations: Conversation[] = [
  // ... define your mockConversations here, including messages ...
];

const MessagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get("supplier");

  // Filter for supplier conversations if supplierId is provided
  const conversations = supplierId
    ? mockConversations.filter((conv) =>
        conv.participants.some((p) => p.id === `supplier-${supplierId}`)
      )
    : mockConversations;

  return (
    <div>
      <PageHeader
        title="Messages"
        description="View and manage your conversations"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Messages" }]}
      />
      <B2BMessagingSystem
        conversations={conversations}
        activeUser={activeUser}
      />
    </div>
  );
};

export default MessagesPage;
