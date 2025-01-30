import { Menu, X, LayoutGrid } from "lucide-react";

export default function MenuToggle(props: { onClick: () => void; isOpen: boolean }) {
  return (
    <button className="lg:hidden p-2" onClick={props.onClick}>
      {props.isOpen ? <X /> : <LayoutGrid />}
    </button>
  );
}
