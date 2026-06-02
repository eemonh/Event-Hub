import { useMediaQuery } from "react-responsive";

export default function useIsDesktop(): boolean {
  return useMediaQuery({ query: "(min-width: 768px)" });
}
