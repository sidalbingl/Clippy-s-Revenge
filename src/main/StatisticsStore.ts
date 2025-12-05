/**
 * StatisticsStore - Tracks analysis statistics
 */

export interface AnalysisRecord {
  filePath: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: number;
}

export interface Statistics {
  totalAnalyses: number;
  roastsDelivered: number;
  criticalIssues: number;
  angryMoments: number;
  severityDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  problemFiles: Array<{
    filePath: string;
    issueCount: number;
  }>;
  recentAnalyses: AnalysisRecord[];
}

class StatisticsStore {
  private analyses: AnalysisRecord[] = [];
  private fileIssueCount: Map<string, number> = new Map();

  addAnalysis(record: AnalysisRecord): void {
    this.analyses.push(record);
    
    // Update file issue count
    const currentCount = this.fileIssueCount.get(record.filePath) || 0;
    this.fileIssueCount.set(record.filePath, currentCount + 1);
    
    // Keep only last 1000 analyses
    if (this.analyses.length > 1000) {
      this.analyses = this.analyses.slice(-1000);
    }
  }

  getStatistics(): Statistics {
    const severityDistribution = {
      low: 0,
      medium: 0,
      high: 0,
    };

    let angryMoments = 0;

    this.analyses.forEach((record) => {
      severityDistribution[record.severity]++;
      if (record.severity === 'high') {
        angryMoments++;
      }
    });

    // Get top problem files
    const problemFiles = Array.from(this.fileIssueCount.entries())
      .map(([filePath, issueCount]) => ({ filePath, issueCount }))
      .sort((a, b) => b.issueCount - a.issueCount)
      .slice(0, 5);

    return {
      totalAnalyses: this.analyses.length,
      roastsDelivered: this.analyses.length,
      criticalIssues: severityDistribution.high,
      angryMoments,
      severityDistribution,
      problemFiles,
      recentAnalyses: this.analyses.slice(-10),
    };
  }

  reset(): void {
    this.analyses = [];
    this.fileIssueCount.clear();
  }
}

export const statisticsStore = new StatisticsStore();
