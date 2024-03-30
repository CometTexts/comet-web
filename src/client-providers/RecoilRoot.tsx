"use client";

import { RecoilRoot } from "recoil";

const ClientRecoilRoot: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default ClientRecoilRoot;
