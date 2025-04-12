export interface User {
    id: number;
    username: string;
  }
  
  export interface Ticket {
    id: number;
    status: string;
    notes?: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    amount: number;
    createdBy: number;
    assignedTo?: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    creator?: User;
    assignee?: User;
  }