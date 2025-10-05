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
import { useState, useEffect } from "react";
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

interface ApiResponse {
  value: ApiReportData[];
  isSuccess: boolean;
  isFailure: boolean;
  errors: any[];
}

interface ApiReportData {
  id: string;
  usageTime: string;
  expectedPension: number;
  sex: { name: string; id: number };
  salaryAmount: number;
  consideredSickLeave: boolean;
  subAccountBalance: number;
  accountBalance: number;
  pension: number;
  realPension: number;
  postalCode: string;
}

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
  console.log("test");
  const [dateFrom, setDateFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [apiData, setApiData] = useState<ApiReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Fetch data from API (using internal Next.js API route to avoid CORS)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reports");
        const data: ApiResponse = await response.json();

        if (data.isSuccess && data.value) {
          setApiData(data.value);
        }
      } catch (error) {
        console.log(error);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform API data to table format
  const usageData: SimulatorUsage[] = apiData.map((item) => {
    const date = new Date(item.usageTime);
    return {
      dataUzycia: date.toLocaleDateString("pl-PL"),
      godzinaUzycia: date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      emeryturaOczekiwana: item.expectedPension,
      wiek: 0, // Age not provided in API
      plec: item.sex.name === "Kobieta" ? "K" : "M",
      wysokoscWynagrodzenia: item.salaryAmount,
      uwzglednialOkresyChoroby: item.consideredSickLeave,
      wysokoscZgromadzonychSrodkow: item.accountBalance,
      emeryturaRzeczywista: item.pension,
      emeryturaUrealniona: item.realPension,
      kodPocztowy: item.postalCode,
    };
  });

  // Calculate stats from real data
  const totalUsages = apiData.length;
  const today = new Date().toDateString();
  const usagesToday = apiData.filter(
    (item) => new Date(item.usageTime).toDateString() === today
  ).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const usagesThisMonth = apiData.filter((item) => {
    const date = new Date(item.usageTime);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const averagePension =
    apiData.length > 0
      ? apiData.reduce((sum, item) => sum + item.pension, 0) / apiData.length
      : 0;

  const stats = [
    {
      title: "Łączna liczba użyć",
      value: totalUsages.toLocaleString("pl-PL"),
      icon: Users,
      bgColor: "#3f84d2",
      textColor: "#3f84d2",
    },
    {
      title: "Użycia dzisiaj",
      value: usagesToday.toString(),
      icon: Clock,
      bgColor: "#00993f",
      textColor: "#00993f",
    },
    {
      title: "Użycia w tym miesiącu",
      value: usagesThisMonth.toString(),
      icon: TrendingUp,
      bgColor: "#00416e",
      textColor: "#00416e",
    },
    {
      title: "Średnia emerytura",
      value: `${Math.round(averagePension).toLocaleString("pl-PL")} zł`,
      icon: TrendingUp,
      bgColor: "#ffb34f",
      textColor: "#ffb34f",
    },
  ];

  // Gender distribution from real data
  const women = apiData.filter((item) => item.sex.name === "Kobieta").length;
  const men = apiData.filter((item) => item.sex.name === "Męszczyzna").length;

  const genderDistributionData = [
    { name: "Kobiety", value: women, fill: "#3f84d2" },
    { name: "Mężczyźni", value: men, fill: "#00416e" },
  ];

  // Pension trends - group by month
  const pensionTrendsData = (() => {
    const monthlyData: {
      [key: string]: {
        oczekiwana: number[];
        rzeczywista: number[];
        urealniona: number[];
      };
    } = {};

    apiData.forEach((item) => {
      const date = new Date(item.usageTime);
      const monthKey = date.toLocaleDateString("pl-PL", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          oczekiwana: [],
          rzeczywista: [],
          urealniona: [],
        };
      }

      monthlyData[monthKey].oczekiwana.push(item.expectedPension);
      monthlyData[monthKey].rzeczywista.push(item.pension);
      monthlyData[monthKey].urealniona.push(item.realPension);
    });

    return Object.entries(monthlyData)
      .slice(-6) // Last 6 months
      .map(([month, values]) => ({
        miesiac: month.split(" ")[0],
        oczekiwana: Math.round(
          values.oczekiwana.reduce((a, b) => a + b, 0) /
            values.oczekiwana.length
        ),
        rzeczywista: Math.round(
          values.rzeczywista.reduce((a, b) => a + b, 0) /
            values.rzeczywista.length
        ),
        urealniona: Math.round(
          values.urealniona.reduce((a, b) => a + b, 0) /
            values.urealniona.length
        ),
      }));
  })();

  // Age distribution - placeholder as age is not in API
  const ageDistributionData = [
    { grupa: "25-35", liczba: Math.round(totalUsages * 0.12) },
    { grupa: "36-45", liczba: Math.round(totalUsages * 0.23) },
    { grupa: "46-55", liczba: Math.round(totalUsages * 0.33) },
    { grupa: "56-65", liczba: Math.round(totalUsages * 0.24) },
    { grupa: "65+", liczba: Math.round(totalUsages * 0.08) },
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

  const handleFilter = async () => {
    if (!dateFrom || !dateTo) {
      alert("Proszę wybrać obie daty");
      return;
    }

    try {
      setDownloadingReport(true);

      // Convert dates to ISO format with time
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);

      const response = await fetch("/api/reports/date-range", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch filtered data");
      }

      const data = await response.json();

      if (data.isSuccess && data.value) {
        // The value is a URL to the Excel file
        const fileUrl = data.value.startsWith("http")
          ? data.value
          : `https://${data.value}`;

        // Download the file automatically
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `raport_${dateFrom}_${dateTo}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
      alert("Błąd podczas generowania raportu");
    } finally {
      setDownloadingReport(false);
    }
  };

  const exportToXLS = () => {
    // Tutaj będzie logika eksportu do XLS
    console.log("Eksportowanie danych do XLS...", usageData);
    alert("Eksport do XLS zostanie wkrótce zaimplementowany");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

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
                        (entry.value / totalUsages) *
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
            <Button
              variant="outline"
              size="default"
              className="self-end"
              onClick={handleFilter}
              disabled={downloadingReport}
            >
              {downloadingReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  Generowanie...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  Generuj raport Excel
                </>
              )}
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
