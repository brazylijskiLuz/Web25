"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface SimulatorUsage {
  dataUzycia: string;
  godzinaUzycia: string;
  emeryturaOczekiwana: number;
  wiek: number;
  plec: string;
  wysokoscWynagrodzenia: number;
  uwzglednialOkresyChoroby: boolean;
  wysokoscZgromadzonychSrodkow: number;
  emeryturaRzeczywista: number;
  emeryturaUrealniona: number;
  kodPocztowy: string;
}

export default function AdminPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);

  const stats = [
    {
      title: "Łączna liczba użyć",
      value: "1,247",
      icon: Users,
      bgColor: "#3f84d2",
      textColor: "#3f84d2",
    },
    {
      title: "Użycia dzisiaj",
      value: "43",
      icon: Clock,
      bgColor: "#00993f",
      textColor: "#00993f",
    },
    {
      title: "Użycia w tym miesiącu",
      value: "387",
      icon: TrendingUp,
      bgColor: "#00416e",
      textColor: "#00416e",
    },
    {
      title: "Średnia emerytura",
      value: "3,245 zł",
      icon: TrendingUp,
      bgColor: "#ffb34f",
      textColor: "#ffb34f",
    },
  ];

  // Przykładowe dane użycia symulatora
  const usageData: SimulatorUsage[] = [
    {
      dataUzycia: "2024-10-04",
      godzinaUzycia: "14:32",
      emeryturaOczekiwana: 4500,
      wiek: 45,
      plec: "K",
      wysokoscWynagrodzenia: 6500,
      uwzglednialOkresyChoroby: true,
      wysokoscZgromadzonychSrodkow: 125000,
      emeryturaRzeczywista: 3245,
      emeryturaUrealniona: 3580,
      kodPocztowy: "00-001",
    },
    {
      dataUzycia: "2024-10-04",
      godzinaUzycia: "13:15",
      emeryturaOczekiwana: 5000,
      wiek: 52,
      plec: "M",
      wysokoscWynagrodzenia: 8200,
      uwzglednialOkresyChoroby: false,
      wysokoscZgromadzonychSrodkow: 185000,
      emeryturaRzeczywista: 4120,
      emeryturaUrealniona: 4550,
      kodPocztowy: "02-495",
    },
    {
      dataUzycia: "2024-10-04",
      godzinaUzycia: "11:48",
      emeryturaOczekiwana: 3800,
      wiek: 38,
      plec: "K",
      wysokoscWynagrodzenia: 5500,
      uwzglednialOkresyChoroby: true,
      wysokoscZgromadzonychSrodkow: 95000,
      emeryturaRzeczywista: 2850,
      emeryturaUrealniona: 3140,
      kodPocztowy: "31-530",
    },
  ];

  // Dane do wykresów
  const genderDistributionData = [
    { name: "Kobiety", value: 634, fill: "#3f84d2" },
    { name: "Mężczyźni", value: 613, fill: "#00416e" },
  ];

  const pensionTrendsData = [
    { miesiac: "Sty", oczekiwana: 4200, rzeczywista: 3100, urealniona: 3450 },
    { miesiac: "Lut", oczekiwana: 4350, rzeczywista: 3200, urealniona: 3520 },
    { miesiac: "Mar", oczekiwana: 4400, rzeczywista: 3250, urealniona: 3600 },
    { miesiac: "Kwi", oczekiwana: 4500, rzeczywista: 3300, urealniona: 3680 },
    { miesiac: "Maj", oczekiwana: 4550, rzeczywista: 3350, urealniona: 3720 },
    { miesiac: "Cze", oczekiwana: 4600, rzeczywista: 3400, urealniona: 3780 },
  ];

  const ageDistributionData = [
    { grupa: "25-35", liczba: 145 },
    { grupa: "36-45", liczba: 287 },
    { grupa: "46-55", liczba: 412 },
    { grupa: "56-65", liczba: 298 },
    { grupa: "65+", liczba: 105 },
  ];

  const chartConfig = {
    uzycia: {
      label: "Użycia",
      color: "hsl(var(--chart-1))",
    },
    oczekiwana: {
      label: "Oczekiwana",
      color: "hsl(var(--chart-3))",
    },
    rzeczywista: {
      label: "Rzeczywista",
      color: "hsl(var(--chart-1))",
    },
    urealniona: {
      label: "Urealniona",
      color: "hsl(var(--chart-2))",
    },
    liczba: {
      label: "Liczba użytkowników",
      color: "hsl(var(--chart-4))",
    },
  };

  const exportToXLS = () => {
    // Tutaj będzie logika eksportu do XLS
    console.log("Eksportowanie danych do XLS...");
    alert("Eksport do XLS zostanie wkrótce zaimplementowany");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Panel Administratora
          </h1>
          <p className="mt-2 text-muted-foreground">
            Raportowanie zainteresowania symulatorem emerytalnym
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-12 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${stat.bgColor}20`,
                    }}
                  >
                    <Icon
                      className="size-6"
                      style={{ color: stat.textColor }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </h3>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pension Trends Chart - Full Width */}
        <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-foreground">
            Trendy emerytalne w czasie
          </h2>
          <div className="w-full h-[400px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <LineChart data={pensionTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="miesiac" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="oczekiwana"
                  stroke="#ffb34f"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#ffb34f" }}
                  name="Oczekiwana"
                />
                <Line
                  type="monotone"
                  dataKey="rzeczywista"
                  stroke="#3f84d2"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#3f84d2" }}
                  name="Rzeczywista"
                />
                <Line
                  type="monotone"
                  dataKey="urealniona"
                  stroke="#00993f"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#00993f" }}
                  name="Urealniona"
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        {/* Other Charts Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Gender Distribution Chart */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              Rozkład płci użytkowników
            </h2>
            <div className="w-full h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={genderDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.name}: ${entry.value} (${(
                        (entry.value / 1247) *
                        100
                      ).toFixed(1)}%)`
                    }
                  >
                    {genderDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          {/* Age Distribution Chart */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-foreground">
              Rozkład wiekowy użytkowników
            </h2>
            <div className="w-full h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={ageDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grupa" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="liczba" fill="#00416e" radius={8} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mb-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Eksport danych do XLS
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pobierz raport z użycia symulatora w formacie Excel
              </p>
            </div>
            <Button onClick={exportToXLS} size="lg">
              <Download className="size-5" />
              Eksportuj do XLS
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 rounded-lg bg-muted/50 p-4">
            <div className="flex flex-1 items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Data od:
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Data do:
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                />
              </div>
            </div>
            <Button variant="outline" size="default" className="self-end">
              <Filter className="size-4" />
              Filtruj
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b bg-muted/50 px-6 py-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <FileSpreadsheet className="size-5" />
              Dane użycia symulatora
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Data użycia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Godzina
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Wiek
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Płeć
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Wynagrodzenie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Em. oczekiwana
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Em. rzeczywista
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Em. urealniona
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Okresy choroby
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Zgromadzone środki
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Kod pocztowy
                  </th>
                </tr>
              </thead>
              <tbody>
                {usageData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 text-sm">{row.dataUzycia}</td>
                    <td className="px-4 py-3 text-sm">{row.godzinaUzycia}</td>
                    <td className="px-4 py-3 text-sm">{row.wiek}</td>
                    <td className="px-4 py-3 text-sm">{row.plec}</td>
                    <td className="px-4 py-3 text-sm">
                      {row.wysokoscWynagrodzenia.toLocaleString()} zł
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.emeryturaOczekiwana.toLocaleString()} zł
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.emeryturaRzeczywista.toLocaleString()} zł
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.emeryturaUrealniona.toLocaleString()} zł
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.uwzglednialOkresyChoroby ? "Tak" : "Nie"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {row.wysokoscZgromadzonychSrodkow.toLocaleString()} zł
                    </td>
                    <td className="px-4 py-3 text-sm">{row.kodPocztowy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t bg-muted/30 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Wyświetlono {usageData.length} z {usageData.length} rekordów
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
