import React, { useEffect, useRef, useState } from 'react';
import { setupCanvas, observeCanvas } from '../lib/canvasKit';
import type { WidgetProps } from './registry';

const W = 700;
const H = 190;
const stages = [
  { name: '特征提取', shape: '9×9 · 64', color: '#b8c9a7', note: '输入块已转为 64 张局部特征图；当前观察特征提取。' },
  { name: '非线性映射', shape: '1×1 · 32', color: '#b8c9a7', note: '64 张特征图经 1×1 卷积映射为 32 张；当前观察特征变换。' },
  { name: '图像重建', shape: '5×5 · 1', color: '#b8c9a7', note: '32 张映射特征合成为 1 张亮度预测图；当前观察最终重建。' },
];

export const SrcnnExplore: React.FC<WidgetProps> = ({ chapterId, moduleId }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const position = stage;
  const activeIndex = Math.min(2, Math.floor(position));
  const selected = stages[activeIndex];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D;
    try { ctx = setupCanvas(canvas, W, H); } catch { return; }

    const draw = () => {
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#f5f8f0'; ctx.fillRect(0, 0, W, H);
      // Stage-dependent tensor previews: input patch, 64 feature maps, 32 mapped maps, or reconstructed luminance.
      const labels = ['输入图像块', '64 张特征图', '32 张映射特征', '亮度重建图'];
      const blend = position / 2;
      const count = Math.round(5 + blend * 3);
      const cell = 14 - blend * 7;
      const gap = 4 - blend;
      const gridW = count * cell + (count - 1) * gap;
      const startX = 68 - gridW / 2;
      const startY = stage === 1 ? 72 : 76;
      ctx.fillStyle = '#21324a'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(labels[Math.round(blend * 3)], 68, 52);
      for (let y = 0; y < count; y++) for (let x = 0; x < count; x++) {
        const v = (x * 17 + y * 29 + Math.round(position * 13) + x * y * 7) % 100;
        ctx.fillStyle = v > 62 ? '#27446e' : v > 35 ? '#b8c9a7' : '#ffffff';
        ctx.fillRect(startX + x * (cell + gap), startY + y * (cell + gap), cell, cell);
      }
      // Highlight active stage while keeping the full SRCNN path visible.
      ctx.strokeStyle = '#d7deea'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(132, 104); ctx.lineTo(570, 104); ctx.stroke();
      stages.forEach((item, i) => {
        const x = 160 + i * 150;
        ctx.fillStyle = '#b8c9a7'; ctx.fillRect(x, 78, 112, 46);
        ctx.strokeStyle = Math.abs(i - position) < 0.5 ? '#f07e47' : '#d7deea'; ctx.lineWidth = Math.abs(i - position) < 0.5 ? 4 : 1;
        ctx.strokeRect(x, 78, 112, 46);
        ctx.fillStyle = '#21324a'; ctx.font = 'bold 13px sans-serif';
        ctx.fillText(item.name, x + 56, 96); ctx.fillText(item.shape, x + 56, 114);
      });
      ctx.textAlign = 'left'; ctx.fillStyle = '#68778f'; ctx.font = '13px sans-serif';
      ctx.fillText(`当前：${selected.name}`, 220, 158);
      ctx.fillStyle = selected.color; ctx.fillRect(492 + position * 15, 143, 16, 16);
      ctx.fillStyle = '#68778f'; ctx.fillText(['特征图', '映射特征', '亮度输出'][Math.round(position)], 540, 158);
    };
    draw(); canvas.classList.add('is-ready');
    return observeCanvas(canvas, draw, () => {});
  }, [stage, selected]);

  return <div>
    <canvas id={`cv-${chapterId}-${moduleId}`} ref={ref} width={W} height={H} aria-label={`SRCNN ${selected.name}阶段：${selected.shape}`}  />
    <div className="ctrl">
      <label htmlFor={`stage-${chapterId}-${moduleId}`}>当前层 <span className="val">{selected.name} · {selected.shape}</span></label>
      <input id={`stage-${chapterId}-${moduleId}`} aria-label="选择 SRCNN 网络层" type="range" min="0" max="2" step="0.01" value={stage} onChange={e => setStage(Number(e.target.value))} />
    </div>
    <div className="feedback">{selected.note} 拖动滑块查看三层结构；高亮层与说明同步变化。</div>
  </div>;
};
