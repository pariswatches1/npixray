import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const revalidate = 86400;

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Run all queries in parallel
    const [
      providerCountResult,
      billingCountResult,
      totalPaymentResult,
      topSpecialtiesResult,
      programAdoptionResult,
      emDistributionResult,
    ] = await Promise.all([
      // Total providers
      sql.query("SELECT COUNT(*) as count FROM providers"),

      // Total billing records
      sql.query("SELECT COUNT(*) as count FROM provider_codes"),

      // Total Medicare payments
      sql.query(
        "SELECT SUM(total_medicare_payment) as total FROM providers"
      ),

      // Top 10 specialties by provider count
      sql.query(
        `SELECT specialty,
                COUNT(*) as provider_count,
                AVG(total_medicare_payment) as avg_revenue,
                SUM(total_medicare_payment) as total_revenue
         FROM providers
         WHERE specialty != ''
         GROUP BY specialty
         ORDER BY provider_count DESC
         LIMIT 10`
      ),

      // Program adoption rates (CCM, RPM, BHI, AWV)
      sql.query(
        `SELECT
           COUNT(*) as total_providers,
           COUNT(CASE WHEN ccm_99490_services > 0 THEN 1 END) as ccm_providers,
           COUNT(CASE WHEN rpm_99454_services > 0 OR rpm_99457_services > 0 THEN 1 END) as rpm_providers,
           COUNT(CASE WHEN bhi_99484_services > 0 THEN 1 END) as bhi_providers,
           COUNT(CASE WHEN awv_g0438_services > 0 OR awv_g0439_services > 0 THEN 1 END) as awv_providers
         FROM providers`
      ),

      // E&M distribution
      sql.query(
        `SELECT
           SUM(em_99211) as total_99211,
           SUM(em_99212) as total_99212,
           SUM(em_99213) as total_99213,
           SUM(em_99214) as total_99214,
           SUM(em_99215) as total_99215,
           SUM(em_total) as total_em
         FROM providers
         WHERE em_total > 0`
      ),
    ]);

    const totalProviders = Number(providerCountResult[0]?.count ?? 0);
    const totalBillingRecords = Number(billingCountResult[0]?.count ?? 0);
    const totalMedicarePayments = Number(
      totalPaymentResult[0]?.total ?? 0
    );

    // Top specialties
    const topSpecialties = topSpecialtiesResult.map((row: any) => ({
      specialty: row.specialty,
      provider_count: Number(row.provider_count),
      avg_revenue: Math.round(Number(row.avg_revenue) * 100) / 100,
      total_revenue: Math.round(Number(row.total_revenue) * 100) / 100,
    }));

    // Program adoption
    const adoptionRow = programAdoptionResult[0];
    const adoptionTotal = Number(adoptionRow?.total_providers ?? 1);
    const programAdoption = {
      ccm_rate:
        Math.round(
          (Number(adoptionRow?.ccm_providers ?? 0) / adoptionTotal) * 10000
        ) / 100,
      rpm_rate:
        Math.round(
          (Number(adoptionRow?.rpm_providers ?? 0) / adoptionTotal) * 10000
        ) / 100,
      bhi_rate:
        Math.round(
          (Number(adoptionRow?.bhi_providers ?? 0) / adoptionTotal) * 10000
        ) / 100,
      awv_rate:
        Math.round(
          (Number(adoptionRow?.awv_providers ?? 0) / adoptionTotal) * 10000
        ) / 100,
    };

    // E&M distribution
    const emRow = emDistributionResult[0];
    const totalEm = Number(emRow?.total_em ?? 1);
    const emDistribution = {
      pct_99211:
        Math.round((Number(emRow?.total_99211 ?? 0) / totalEm) * 10000) / 100,
      pct_99212:
        Math.round((Number(emRow?.total_99212 ?? 0) / totalEm) * 10000) / 100,
      pct_99213:
        Math.round((Number(emRow?.total_99213 ?? 0) / totalEm) * 10000) / 100,
      pct_99214:
        Math.round((Number(emRow?.total_99214 ?? 0) / totalEm) * 10000) / 100,
      pct_99215:
        Math.round((Number(emRow?.total_99215 ?? 0) / totalEm) * 10000) / 100,
    };

    const response = NextResponse.json({
      meta: {
        source: "NPIxray Medicare Provider Revenue Analysis",
        dataset: "CMS Medicare Physician & Other Practitioners",
        url: "https://npixray.com/research",
        api_docs: "https://npixray.com/api-docs",
        generated_at: new Date().toISOString(),
      },
      database_scope: {
        providers: totalProviders,
        billing_records: totalBillingRecords,
        specialties: topSpecialties.length,
        states: 55,
      },
      national_totals: {
        total_providers: totalProviders,
        total_billing_records: totalBillingRecords,
        total_medicare_payments:
          Math.round(totalMedicarePayments * 100) / 100,
      },
      top_specialties: topSpecialties,
      program_adoption: programAdoption,
      em_distribution: emDistribution,
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=172800"
    );

    return response;
  } catch (err) {
    console.error("Stats API error:", err);

    // Fallback with static data when database is unavailable
    const fallback = {
      meta: {
        source: "NPIxray Medicare Provider Revenue Analysis",
        dataset: "CMS Medicare Physician & Other Practitioners",
        url: "https://npixray.com/research",
        api_docs: "https://npixray.com/api-docs",
        generated_at: new Date().toISOString(),
        note: "Static fallback data — live database temporarily unavailable",
      },
      database_scope: {
        providers: 1175281,
        billing_records: 8153253,
        specialties: 20,
        states: 55,
      },
      national_totals: {
        total_providers: 1175281,
        total_billing_records: 8153253,
        total_medicare_payments: 92400000000,
      },
      top_specialties: [
        { specialty: "Internal Medicine", provider_count: 88703, avg_revenue: 77297, total_revenue: 6856464891 },
        { specialty: "Family Medicine", provider_count: 78514, avg_revenue: 55556, total_revenue: 4361487384 },
        { specialty: "Orthopedics", provider_count: 20699, avg_revenue: 102233, total_revenue: 2116132267 },
        { specialty: "Cardiology", provider_count: 19399, avg_revenue: 179674, total_revenue: 3485537726 },
        { specialty: "Psychiatry", provider_count: 18253, avg_revenue: 31564, total_revenue: 576140692 },
        { specialty: "OB/GYN", provider_count: 17962, avg_revenue: 15432, total_revenue: 277189704 },
        { specialty: "Neurology", provider_count: 15573, avg_revenue: 79417, total_revenue: 1236998841 },
        { specialty: "Gastroenterology", provider_count: 14124, avg_revenue: 76335, total_revenue: 1078345740 },
        { specialty: "Dermatology", provider_count: 12160, avg_revenue: 224383, total_revenue: 2728497280 },
        { specialty: "Pulmonology", provider_count: 10381, avg_revenue: 95480, total_revenue: 990947880 },
      ],
      program_adoption: {
        ccm_rate: 4.5,
        rpm_rate: 2.8,
        bhi_rate: 0.7,
        awv_rate: 35.2,
      },
      em_distribution: {
        pct_99211: 2.1,
        pct_99212: 7.8,
        pct_99213: 30.2,
        pct_99214: 49.6,
        pct_99215: 10.3,
      },
    };

    const response = NextResponse.json(fallback);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );
    return response;
  }
}
