import { HomeIcon, P2PIcon, PaymentIcon, TransactionsIcon, TransferIcon } from "../../components/Icons/dashboardicons";
import { SidebarItem } from "../../components/SlidebarItem";


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex">
        <div className="w-72 border-r bg-sky-800 border-slate-700 min-h-screen mr-4 pt-28">
            <div>
                <SidebarItem href={"/dashboard"} icon={<HomeIcon/>} title="Home" />
                <SidebarItem href={"/transfer"} icon={<TransferIcon />} title="Transfer" />
                <SidebarItem href={"/transactions"} icon={<TransactionsIcon />} title="Transactions" />
                <SidebarItem href={"/razorpay"} icon={<PaymentIcon />} title="Razor-pay" />
                <SidebarItem href={"/p2p"} icon={<P2PIcon />} title="P2P" />
            </div>
        </div>
            {children}
    </div>
  );
}

