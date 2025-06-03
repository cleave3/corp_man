import OverviewStats from "./OverviewStats";
import YearlyStats from "./YearlyStats";
import TransactionStats from "./TransactionStats";
import InitiatorStats from "./InitiatorStats";

export default function Home() {
    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <OverviewStats />
                </div>

                <div className="col-span-12 xl:col-span-4">
                    <TransactionStats />
                </div>

                <div className="col-span-12 xl:col-span-8">
                    <YearlyStats />
                </div>
                <div className="col-span-12 xl:col-span-4">
                    <InitiatorStats />
                </div>
            </div>
        </>
    );
}
