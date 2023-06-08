import React from "react";

import { type IChannel } from "@/interfaces";

export type ChannelContextType = {
  channels: IChannel[];
  activeChannel?: IChannel;
  setActiveChannel?: (activeChannel: IChannel) => void;
};

const defaultState = {
  channels: [],
};

export const ChannelContext = React.createContext<ChannelContextType>(defaultState);
