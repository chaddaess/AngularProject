import { Component, AfterViewInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bmi-calculator',
  templateUrl: './bmi-calculator.component.html',
  standalone: true,
  styleUrls: ['./bmi-calculator.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class BmiCalculatorComponent implements AfterViewInit {
  heightControl = new FormControl<number | null>(null);
  weightControl = new FormControl<number | null>(null);
  bmi: number | null = null;
  chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.initializeChart();

    this.heightControl.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(() => this.updateChart());

    this.weightControl.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(() => this.updateChart());
  }

  calculateBMI(): void {
    const height = this.heightControl.value;
    const weight = this.weightControl.value;
    if (height && weight) {
      this.bmi = +(weight / ((height / 100) ** 2)).toFixed(1); // Calculate BMI
    } else {
      this.bmi = null;
    }
  }
  
  initializeChart(): void {
    const canvas = document.getElementById('bmiChart') as HTMLCanvasElement;
    const calculateWeight = (height: number, bmi: number): number => {
      return bmi * ((height / 100) ** 2);
    };
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context from canvas!');
      return;
    }

    const bmiRanges = [
      { label: 'Underweight', minBMI: 0, maxBMI: 18.5, color: '#FDB462' },
      { label: 'Normal', minBMI: 18.5, maxBMI: 24.9, color: '#B3DE69' },
      { label: 'Overweight', minBMI: 24.9, maxBMI: 29.9, color: '#FFD700' },
      { label: 'Obese', minBMI: 29.9, maxBMI: 100, color: '#FF6347' },
    ];

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'User Data',
            data: [],
            backgroundColor: '#000000',
            pointStyle: 'circle',
            pointRadius: 6,
          },
          ...bmiRanges.map(range => ({
            label: range.label,
            data: [],
            backgroundColor: range.color,
            borderWidth: 0,
          })),
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Height (cm)' },
            min: 140,
            max: 220,
            grid: {
              display: false,
            },
          },
          y: {
            title: { display: true, text: 'Weight (kg)' },
            min: 30,
            max: 150,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: false, 
          },
          legend: {
            display: true,
            labels: {
              boxWidth: 20,
              boxHeight: 10,
              padding: 15,
            },
          },
        },
      },
      plugins: [
        // creating the background of the chart
        {
          id: 'bmiBackground',
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            const xScale = chart.scales['x'];
            const yScale = chart.scales['y'];

            const calculateWeight = (height: number, bmi: number): number => {
              return bmi * ((height / 100) ** 2);
            };

            ctx.save();
            ctx.beginPath();
            ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            ctx.clip();

            bmiRanges.forEach((range) => {
              ctx.fillStyle = range.color;
              ctx.beginPath();

              for (let x = chartArea.left; x <= chartArea.right; x++) {
                const height = xScale.getValueForPixel(x);
                if (typeof height === 'number') {
                  const weight = calculateWeight(height, range.minBMI);
                  const y = yScale.getPixelForValue(weight);
                  if (y !== undefined) ctx.lineTo(x, y);
                }
              }

              for (let x = chartArea.right; x >= chartArea.left; x--) {
                const height = xScale.getValueForPixel(x);
                if (typeof height === 'number') {
                  const weight = calculateWeight(height, range.maxBMI);
                  const y = yScale.getPixelForValue(weight);
                  if (y !== undefined) ctx.lineTo(x, y);
                }
              }

              ctx.closePath();
              ctx.fill();
            });

            ctx.restore();
          },
        },
        // hover box logic
        {
          id: 'verticalLines',
          afterEvent: (chart, args) => {
            const event = args.event;
            const canvas = chart.canvas;
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            const xAxis = chart.scales['x'];
            const yAxis = chart.scales['y'];
        
            const mouseX = event.x ?? 0;
            const mouseY = event.y ?? 0;
            const isHoveringInsideChart = mouseX >= chartArea.left && mouseX <= chartArea.right && mouseY >= chartArea.top && mouseY <= chartArea.bottom;
            chart.draw();
        
            if (!isHoveringInsideChart) {
              return; 
            }
        
            const height = xAxis.getValueForPixel(mouseX);
        
            const specificHeights = Array.from({ length: 9 }, (_, i) => 140 + i * 15); 
            if (!height) return;
            const hoveredHeight = specificHeights.find(h => Math.abs(h - height) < 1); 
        
            if (hoveredHeight) {
              const lineX = xAxis.getPixelForValue(hoveredHeight);
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(lineX, chartArea.top);
              ctx.lineTo(lineX, chartArea.bottom);
              ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
              ctx.lineWidth = 1;
              ctx.stroke();
              ctx.restore();
        
              const tooltipWidth = 160;
              const tooltipHeight = 120;
              const tooltipX = lineX + 10;
              const tooltipY = chartArea.top + 10;
        
              const adjustedX = Math.min(tooltipX, chartArea.right - tooltipWidth);
              const adjustedY = Math.min(tooltipY, chartArea.bottom - tooltipHeight);
        
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillRect(adjustedX, adjustedY, tooltipWidth, tooltipHeight);
              ctx.fillStyle = '#000000';
              ctx.font = '12px Arial';
              ctx.fillText(`Height: ${hoveredHeight} cm`, adjustedX + 10, adjustedY + 20);
        
              bmiRanges.forEach((range, index) => {
                const minWeight = calculateWeight(hoveredHeight, range.minBMI);
                const maxWeight = calculateWeight(hoveredHeight, range.maxBMI);
                ctx.fillText(`${range.label}: ${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`, adjustedX + 10, adjustedY + 40 + index * 20);
              });
            }
          },
        }
      ],
    });
  }

  updateChart(): void {
    this.calculateBMI();
    if (this.chart && this.heightControl.value && this.weightControl.value) {
      const userPoint = { x: this.heightControl.value, y: this.weightControl.value };
      this.chart.data.datasets[0].data = [userPoint];
      this.chart.update();
    }
  }
}