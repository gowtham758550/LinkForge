import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NgApexchartsModule } from 'ng-apexcharts';
import { UrlStore } from '../../data-access/url.store';
import { ErrorBannerComponent } from '../../../shared/ui/error-banner/error-banner.component';
import { SkeletonComponent } from '../../../shared/ui/skeleton/skeleton.component';

const PRIMARY = '#970747';

@Component({
  selector: 'app-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    FaIconComponent,
    NgApexchartsModule,
    ErrorBannerComponent,
    SkeletonComponent,
  ],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  readonly urlStore = inject(UrlStore);
  private readonly route = inject(ActivatedRoute);
  readonly faArrowLeft = faArrowLeft;

  readonly chartConfig = {
    type: 'area' as const,
    height: 280,
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true, speed: 400 },
    fontFamily: 'Inter, system-ui, sans-serif',
  };

  readonly chartFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.02, stops: [0, 100] },
  };

  readonly chartStroke = { curve: 'smooth' as const, width: 2.5 };
  readonly chartDataLabels = { enabled: false };
  readonly chartGrid = {
    borderColor: 'rgba(0,0,0,0.06)',
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { left: 4, right: 4 },
  };
  readonly chartTooltip = { theme: 'light' as const, x: { format: 'MMM d, yyyy' } };
  readonly chartMarkers = { size: 4, colors: [PRIMARY], strokeColors: '#fff', strokeWidth: 2, hover: { size: 6 } };
  readonly chartYAxis = {
    labels: { style: { colors: '#888', fontSize: '11px' }, formatter: (v: number) => `${Math.round(v)}` },
    min: 0,
    forceNiceScale: true,
  };

  readonly chartSeries = computed(() => {
    const a = this.urlStore.selectedAnalytics();
    if (!a) return [];
    return [
      {
        name: 'Clicks',
        data: a.clicksByDay.map(p => ({ x: new Date(p.date).getTime(), y: p.count })),
      },
    ];
  });

  readonly chartXAxis = {
    type: 'datetime' as const,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#888', fontSize: '11px' },
      datetimeFormatter: { day: 'MMM d' },
    },
  };

  readonly sparklineSeries = computed(() => {
    const a = this.urlStore.selectedAnalytics();
    if (!a) return [];
    return [{ name: 'Clicks', data: a.clicksByDay.map(p => p.count) }];
  });

  readonly sparklineConfig = {
    type: 'area' as const,
    height: 50,
    sparkline: { enabled: true },
    animations: { enabled: false },
  };

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('shortCode')!;
    this.urlStore.loadAnalytics(code);
  }

  retry(): void {
    const code = this.route.snapshot.paramMap.get('shortCode')!;
    this.urlStore.loadAnalytics(code);
  }
}
