import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UrlStore } from '../../data-access/url.store';

@Component({
  selector: 'app-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, DecimalPipe, FaIconComponent, NgApexchartsModule],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  readonly urlStore = inject(UrlStore);
  readonly faArrowLeft = faArrowLeft;
  private readonly route = inject(ActivatedRoute);

  readonly chartConfig = {
    type: 'area' as const,
    height: 220,
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true, speed: 400 },
  };

  readonly chartFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 100] },
  };

  readonly chartStroke = { curve: 'smooth' as const, width: 2 };
  readonly chartDataLabels = { enabled: false };
  readonly chartGrid = {
    borderColor: 'rgba(0,0,0,0.06)',
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 0, right: 0 },
  };
  readonly chartTooltip = { theme: 'light' as const };
  readonly chartMarkers = { size: 4, colors: ['#970747'], strokeColors: '#fff', strokeWidth: 2 };
  readonly chartYAxis = { labels: { style: { colors: '#888', fontSize: '11px' } } };

  readonly chartSeries = computed(() => {
    const a = this.urlStore.selectedAnalytics();
    if (!a) return [];
    return [{ name: 'Clicks', data: this.buildDailyData(a.clickCount) }];
  });

  readonly chartXAxis = computed(() => {
    const labels = this.buildDateLabels();
    return {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#888', fontSize: '11px' } },
    };
  });

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('shortCode')!;
    this.urlStore.loadAnalytics(code);
  }

  private buildDateLabels(): string[] {
    const labels: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
  }

  private buildDailyData(total: number): number[] {
    const weights = [0.08, 0.12, 0.10, 0.18, 0.15, 0.20, 0.17];
    return weights.map(w => Math.round(w * total));
  }
}
