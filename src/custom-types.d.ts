interface AuthUser {
  id: number;
  name: string;
  email: string;
}

declare namespace Express {
  export interface Request {
    user?: AuthUser;
  }
}
declare type MessageType = {
  id: string;
  message: string;
  name: string;
  group_id: string;
  created_at: string;
};

declare type GroupChatUserType = {
  id: string;
  name: string;
  created_at: string;
};

declare type ChatGroupType = {
  id: string;
  name: string;
};
