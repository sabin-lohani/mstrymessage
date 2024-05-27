import { Message } from "@/models/user.models";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}
