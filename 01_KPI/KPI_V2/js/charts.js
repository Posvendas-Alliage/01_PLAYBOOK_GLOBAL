const CHART_THEME = {
    text: '#e6edf3',
    muted: '#7d8590',
    grid: '#30363d',
    fontFamily: 'DM Sans, system-ui, sans-serif'
};

function createBarChart(canvasId, labels, values, colors, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chartInstance) ctx._chartInstance.destroy();

    ctx._chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            resizeDelay: 100,
            plugins: {
                legend: { display: false },
                title: {
                    display: !!title,
                    text: title,
                    color: CHART_THEME.text,
                    font: { size: 14, weight: '600', family: CHART_THEME.fontFamily }
                }
            },
            scales: {
                x: {
                    ticks: { color: CHART_THEME.muted, font: { family: CHART_THEME.fontFamily } },
                    grid: { color: CHART_THEME.grid }
                },
                y: {
                    ticks: { color: CHART_THEME.muted, font: { family: CHART_THEME.fontFamily } },
                    grid: { color: CHART_THEME.grid },
                    beginAtZero: true
                }
            }
        }
    });
    return ctx._chartInstance;
}

function createStackedBarChart(canvasId, labels, datasets, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chartInstance) ctx._chartInstance.destroy();

    ctx._chartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            resizeDelay: 100,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { color: CHART_THEME.muted, font: { family: CHART_THEME.fontFamily } }
                },
                title: {
                    display: !!title,
                    text: title,
                    color: CHART_THEME.text,
                    font: { size: 14, weight: '600', family: CHART_THEME.fontFamily }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: { color: CHART_THEME.muted },
                    grid: { color: CHART_THEME.grid }
                },
                y: {
                    stacked: true,
                    ticks: { color: CHART_THEME.muted },
                    grid: { color: CHART_THEME.grid },
                    beginAtZero: true
                }
            }
        }
    });
    return ctx._chartInstance;
}

function createLineChart(canvasId, labels, datasets, title) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chartInstance) ctx._chartInstance.destroy();

    ctx._chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            resizeDelay: 100,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: CHART_THEME.muted, font: { family: CHART_THEME.fontFamily } }
                },
                title: {
                    display: !!title,
                    text: title,
                    color: CHART_THEME.text,
                    font: { size: 14, weight: '600', family: CHART_THEME.fontFamily }
                }
            },
            scales: {
                x: { ticks: { color: CHART_THEME.muted }, grid: { color: CHART_THEME.grid } },
                y: { ticks: { color: CHART_THEME.muted }, grid: { color: CHART_THEME.grid }, beginAtZero: true }
            }
        }
    });
    return ctx._chartInstance;
}

function createBarChartWithTarget(canvasId, labels, values, colors, title, targetValue, targetLabel, maxY) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (ctx._chartInstance) ctx._chartInstance.destroy();

    const datasets = [{
        type: 'bar',
        label: ' ',
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
        order: 2
    }];

    if (targetValue !== undefined && targetValue !== null) {
        datasets.push({
            type: 'line',
            label: targetLabel || 'Meta',
            data: labels.map(() => targetValue),
            borderColor: 'rgba(228,191,20,0.85)',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            order: 1
        });
    }

    ctx._chartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            resizeDelay: 100,
            plugins: {
                legend: {
                    display: targetValue !== undefined,
                    position: 'top',
                    labels: { color: CHART_THEME.muted, font: { family: CHART_THEME.fontFamily }, filter: item => item.datasetIndex > 0 }
                },
                title: {
                    display: !!title,
                    text: title,
                    color: CHART_THEME.text,
                    font: { size: 14, weight: '600', family: CHART_THEME.fontFamily }
                }
            },
            scales: {
                x: {
                    ticks: { color: CHART_THEME.muted, font: { family: CHART_THEME.fontFamily } },
                    grid: { color: CHART_THEME.grid }
                },
                y: {
                    ticks: { color: CHART_THEME.muted, font: { family: CHART_THEME.fontFamily } },
                    grid: { color: CHART_THEME.grid },
                    beginAtZero: true,
                    max: maxY || undefined
                }
            }
        }
    });
    return ctx._chartInstance;
}

function destroyChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (ctx && ctx._chartInstance) {
        ctx._chartInstance.destroy();
        ctx._chartInstance = null;
    }
}

