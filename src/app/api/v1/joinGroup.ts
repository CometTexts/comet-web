import { NextRequest } from "next/server";

export interface JoinGroupBody {
  joinCode: string;
}

export const POST = async (req: NextRequest) => {
  const body: JoinGroupBody = await req.json();
};
