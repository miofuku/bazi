import React, { createContext, useContext } from 'react';

// Threads the current reading's accent colours down to the section components,
// so eyebrows, headers, and chips all take on the person's element.
interface AccentTheme {
  accent: string;
  accentDeep: string;
}

const AtmosphereContext = createContext<AccentTheme>({ accent: '#6E8B6A', accentDeep: '#4F6B4C' });

export const AtmosphereProvider = AtmosphereContext.Provider;

export const useAccent = (): AccentTheme => useContext(AtmosphereContext);
