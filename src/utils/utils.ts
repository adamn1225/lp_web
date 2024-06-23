import { APP } from "@data/config";

// set page title
export function setTitle(title: string) {
  return title === "" ? APP.name : APP.name + " - " + title;
}

//set page sescription
export function setDescription(desc: string) {
  return desc === "" ? APP.description : desc;
}

export function currency(amount: number) {
  return (
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount) + " USD"
  );
}
