import React, { useRef,useEffect,useState } from 'react';
import { 
        Wrench,
    Calendar, Search, 
  BarChart3, TrendingUp, Package, Users, 
  ChevronDown, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

import { Chart as ChartJS,   CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend, } from "chart.js";
import { Chart } from "react-chartjs-2";
import { router } from '@inertiajs/react';
import RoleToolbar from '@/components/role-toolbar';

const MONTHS={
  january: "januari",
  february: "februari",
  march: "maart",
  april: "april",
  may: "mei",
  june: "juni",
  july: "juli",
  august: "augustus",
  september: "september",
  october: "oktober",
  november: "november",
  december: "december"
}
const Stats = ({rents,maintenance,invoices,topProducts,years,months}) => {
    const [searchParam, setSearchParam] = useState([]);
    const [fmonth, setFmonth] = useState();
    const [fyear, setFyear] = useState();
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
    );

    const yearData = {
        labels: Object.values(MONTHS),
        datasets: [
            {
                label: 'theoretische inkomsten',
                data: Object.keys(MONTHS).map((key, index) => {
                    const month = index ;
                    return rents
                        .filter(
                            (r) => new Date(r.pickuptime).getMonth() === month,
                        )
                        .map((rent) => rent.profit)
                        .reduce(
                            (total, num) =>
                                (total = parseFloat((total + num).toFixed(2))),
                            0,
                        );
                }),
                fill: true,
                backgroundColor: '#0f0',
            },
            {
                label: 'werkelijke inkomsten',
                data: Object.keys(MONTHS).map((key, index) => {
                    const month = index ;
                    return invoices
                        .filter(
                            (r) => new Date(r.created_at).getMonth() === month,
                        )
                        .map((rent) =>
                            rent.payments.reduce(
                                (total, num) =>
                                    (total = parseFloat(
                                        (total + num.amount).toFixed(2),
                                    )),
                                0,
                            ),
                        )
                        .reduce(
                            (total, num) =>
                                (total = parseFloat((total + num).toFixed(2))),
                            0,
                        );
                }),
                fill: true,
                backgroundColor: '#00f',
            },
            {
                label: 'onderhoud',
                fill: true,
                data: Object.keys(MONTHS).map((key, index) => {
                    const month = index ;
                    return maintenance
                        .filter((r) => new Date(r.date).getMonth() === month)
                        .map((rent) => rent.cost)
                        .reduce(
                            (total, num) =>
                                (total = parseFloat((total + num).toFixed(2))),
                            0,
                        );
                }),
                backgroundColor: '#f00',
            },
        ],
    };

    const options = {
        responsive: true,
    };

    useEffect(() => {
        const u = getUrlParams();
        setSearchParam(u);
        setFmonth(
            (u.month || new Date())
                .toLocaleString('en-US', { month: 'long' })
                .toLowerCase(),
        );
        setFyear(u.year || new Date().getFullYear());
    }, []);

    function filter(type) {
        const filters = {
            ...{
                year: fyear,
                month: fmonth,
            },
            ...type,
        };
        router.visit(`?${new URLSearchParams(filters)}`);
    }
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
            <RoleToolbar role="beheerder" />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
                <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard Overzicht
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Analyseer de prestaties van uw verhuurvloot.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <select
                                onChange={(e) => {
                                    setFmonth(e.target.value);
                                    filter({ month: e.target.value });
                                }}
                                value={fmonth}
                                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                {Object.keys(MONTHS).map((key,index) => (
                                    <option key={key} value={key} disabled={!months.map(month=>month.m).includes(index+1)}>
                                        {MONTHS[key]}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>

                        <div className="relative">
                            <select
                                value={fyear}
                                onChange={(e) => {
                                    setFyear(e.target.value);
                                    filter({ year: e.target.value });
                                }}
                                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-orange-500/20"
                            >
                                {years.map(year=>(
                                    <option key={year.y} value={year.y}>{year.y}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Quick Stats Cards */}
                {/* <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                      title="Omzet"
                      value="€12,450"
                      change="+12.5%"
                      icon={<TrendingUp className="text-green-500" />}
                  />
                  <StatCard
                      title="Verhuurde Items"
                      value="142"
                      change="+3.2%"
                      icon={<Package className="text-orange-500" />}
                  />
                  <StatCard
                      title="Nieuwe Klanten"
                      value="28"
                      change="-1.4%"
                      icon={<Users className="text-blue-500" />}
                      negative
                  />
                  <StatCard
                      title="Bezetting"
                      value="78%"
                      change="+5.0%"
                      icon={<BarChart3 className="text-purple-500" />}
                  />
              </div> */}

                <div className="space-y-8">
                    {/* Section: Stat top products per month */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Top Producten per Maand
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Meest verhuurde gereedschap en machines.
                                </p>
                            </div>
                            <Calendar className="h-5 w-5 text-slate-300" />
                        </div>

                        {/* Visual Bar Chart Placeholder */}
                        <div className="space-y-6">
                            {topProducts.map(topProduct=>(
                            <ProductBar
                                label={topProduct.name}
                                value={topProduct.aggerator}
                                amount={topProduct.aggerator +" rentals"}
                                color="bg-orange-500"
                            />
                                
                            ))}
                        </div>
                    </div>

                    {/* Section: Stat etc (Omzet Trend) */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Maandelijkse Omzet Trend
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Inkomstenoverzicht van het huidige jaar.
                                </p>
                            </div>
                            <TrendingUp className="h-5 w-5 text-slate-300" />
                        </div>

                        {/* Simulated Line Chart Area */}
                        <div className="-full flex items-end gap-2 px-2">
                            <Chart
                                type="bar"
                                data={yearData}
                                options={options}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 text-slate-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="mb-6 flex items-center gap-2">
                                <div className="rounded-lg bg-orange-500 p-1.5">
                                    <Wrench className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-white">
                                    Build
                                    <span className="text-orange-500">
                                        Rent
                                    </span>
                                </span>
                            </div>
                            <p className="mb-6 leading-relaxed text-slate-400">
                                Your trusted partner for professional-grade
                                building tools and materials. Quality equipment,
                                exactly when you need it.
                            </p>
                            <div className="flex space-x-4">
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                    <span className="font-bold">fb</span>
                                </div>
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                    <span className="font-bold">ig</span>
                                </div>
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                    <span className="font-bold">x</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                Equipment
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Power Tools
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Heavy Machinery
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Scaffolding & Ladders
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Landscaping
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Raw Materials
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                Company
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Pro Accounts
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Locations
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Careers
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                Support
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Rental Policies
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-orange-400"
                                    >
                                        Report an Issue
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
                        <p>
                            © {new Date().getFullYear()} Klusloods. Alle
                            rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a
                                href="#"
                                className="transition-colors hover:text-white"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="transition-colors hover:text-white"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};


function getUrlParams()
{
let urlParams = {
        year:[],
        month:0,
    };

        // Create a URLSearchParams object
        const params = new URLSearchParams(window.location.search);

        // Convert URL parameters to an object
        const paramsObject = {};
        for (const [key, value] of params.entries()) {
            // check if it might be a number and not a empty value because javascipt think that null==0
            if (!isNaN(value) && value!==null)
                paramsObject[key] = Number(value);
            else paramsObject[key] = value;
        }

        urlParams={...urlParams,...paramsObject};
    return urlParams;
}

/* Sub-components for clean code */
const StatCard = ({ title, value, change, icon, negative }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-0.5 ${negative ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
        {negative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
        {change}
      </span>
    </div>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

const ProductBar = ({ label, value, amount, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-bold text-slate-700">{label}</span>
      <span className="text-slate-500">{amount}</span>
    </div>
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default Stats;