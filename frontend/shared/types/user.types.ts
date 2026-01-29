/**
 * User related types
 */

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  following?: number;
  createdAt: string;
}

