import React, { useEffect, useRef, useState } from 'react';
import { setupCanvas, observeCanvas } from '../lib/canvasKit';
import type { WidgetProps } from './registry';

const W = 700;
const H = 190;
type Mode = 'inference' | 'pipeline' | 'ambiguity' | 'upscale' | 'receptive' | 'architecture' | 'loss' | 'speed' | 'results' | 'boundary';

const colors = { bg: '#f5f8f0', light: '#b8c9a7', dark: '#76906a', blue: '#27446e', green: '#228d5c', red: '#c43f52', orange: '#f07e47', ink: '#21324a', muted: '#68778f', line: '#d7deea' };

function draw(ctx: CanvasRenderingContext2D, mode: Mode, value: number, choice: number) {
  ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.fillStyle = colors.bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#17263d'; ctx.font = 'bold 18px Arial, sans-serif';
  if (mode === 'inference') {
    const col = Math.min(4, Math.floor(choice * 5));
    ctx.fillStyle = '#26364d'; ctx.font = 'bold 17px Arial, sans-serif'; ctx.fillText('同一卷积核沿图像滑动，重复计算局部特征', 24, 30);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 5; x++) {
      ctx.fillStyle = (x + y) % 3 === 0 ? '#27446e' : '#b8c9a7';
      ctx.fillRect(48 + x * 38, 62 + y * 25, 30, 18);
    }
    ctx.strokeStyle = '#f07e47'; ctx.lineWidth = 4; ctx.strokeRect(43 + col * 38, 57, 40, 28);
    ctx.fillStyle = '#d7deea'; ctx.fillRect(290, 70, 24, 80);
    ctx.fillStyle = '#27446e'; ctx.fillRect(350, 72 + (col % 3) * 23, 240, 18);
    ctx.fillStyle = '#26364d'; ctx.font = 'bold 15px Arial, sans-serif'; ctx.fillText('当前位置', 55 + col * 38, 174); ctx.fillText('局部响应', 350, 160); return;
  }
  if (mode === 'pipeline') {
    const joint = choice >= 0.5;
    ctx.fillStyle = '#26364d'; ctx.font = 'bold 17px Arial, sans-serif'; ctx.fillText(joint ? 'SRCNN：三层共同训练' : '传统方法：分步设计', 28, 32);
    const xs = joint ? [120, 300, 480] : [70, 240, 410, 570];
    const labels = joint ? ['提取特征', '映射特征', '重建图像'] : ['预处理', '稀疏编码', '字典重建', '重叠块融合'];
    xs.forEach((x, i) => { ctx.fillStyle = joint ? '#b8c9a7' : '#d7deea'; ctx.fillRect(x, 70, joint ? 120 : 95, 50); ctx.strokeStyle = joint ? '#76906a' : '#9aa7b8'; ctx.lineWidth = 2; ctx.strokeRect(x, 70, joint ? 120 : 95, 50); ctx.fillStyle = '#21324a'; ctx.font = 'bold 14px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(labels[i], x + (joint ? 60 : 47), 100); if (i < xs.length - 1) { ctx.strokeStyle = '#9aa7b8'; ctx.beginPath(); ctx.moveTo(x + (joint ? 120 : 95), 95); ctx.lineTo(xs[i + 1], 95); ctx.stroke(); } });
    ctx.textAlign = 'left'; ctx.fillStyle = '#26364d'; ctx.font = 'bold 14px Arial, sans-serif'; ctx.fillText(joint ? '学习目标覆盖整条映射' : '各步骤分别设计，整体难联合优化', 28, 158); return;
  }
  if (mode === 'boundary') {
    const tested = choice < 0.5;
    ctx.fillStyle = '#26364d'; ctx.font = 'bold 17px Arial, sans-serif'; ctx.fillText('结果能推广到什么输入？', 28, 30);
    ctx.fillStyle = tested ? '#228d5c' : '#b8c9a7'; ctx.fillRect(55, 62, 250, 58); ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Arial, sans-serif'; ctx.fillText('论文测试：双三次退化', 70, 97);
    ctx.fillStyle = tested ? '#d7deea' : '#c43f52'; ctx.fillRect(390, 62, 250, 58); ctx.fillStyle = '#21324a'; ctx.fillText('真实相机退化：未验证', 405, 97);
    ctx.fillStyle = '#68778f'; ctx.font = 'bold 14px Arial, sans-serif'; ctx.fillText(tested ? '表 1 的数值只支持左侧协议。' : '不能把表 1 的结果直接外推到右侧。', 55, 158); return;
  }
  if (mode === 'architecture') {
    const xs = [110, 350, 590], labels = ['特征提取', '非线性映射', '重建'], sizes = ['9×9 · 64', '1×1 · 32', '5×5 · 1'];
    ctx.strokeStyle = colors.line; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(550, 90); ctx.stroke();
    xs.forEach((x, i) => { ctx.fillStyle = colors.light; ctx.beginPath(); ctx.roundRect(x - 70, 50, 140, 78, 10); ctx.fill(); ctx.strokeStyle = Math.abs(choice * 2 - i) < 0.5 ? colors.orange : colors.dark; ctx.lineWidth = Math.abs(choice * 2 - i) < 0.5 ? 4 : 1; ctx.stroke(); ctx.fillStyle = '#17263d'; ctx.font = 'bold 17px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(labels[i], x, 81); ctx.fillText(sizes[i], x, 108); });
    ctx.textAlign = 'left'; ctx.fillStyle = colors.muted; ctx.fillText(`当前层：${labels[Math.min(2, Math.round(choice * 2))]}`, 24, 166); return;
  }
  if (mode === 'results') {
    const sets = ['Set5', 'Set14'], ours = [32.75, 29.28], base = [32.59, 29.13];
    const i = choice < 0.5 ? 0 : 1, max = 35, scale = 430 / max;
    ctx.fillText(`${sets[i]} · ×3 · PSNR（分贝，越高越好）`, 28, 28);
    [[base[i], colors.red, 'A+'], [ours[i], colors.green, 'SRCNN']].forEach((row, j) => { const y = 58 + j * 52; ctx.fillStyle = colors.muted; ctx.fillText(row[2] as string, 30, y + 19); ctx.fillStyle = row[1] as string; ctx.fillRect(108, y, (row[0] as number) * scale, 27); ctx.fillStyle = colors.ink; ctx.fillText((row[0] as number).toFixed(2), 550, y + 19); });
    ctx.fillStyle = colors.muted; ctx.fillText('论文表 1；双三次退化；PSNR 越高越好', 28, 164); return;
  }
  if (mode === 'loss') {
    ctx.strokeStyle = colors.line; ctx.beginPath(); ctx.moveTo(50, 155); ctx.lineTo(650, 155); ctx.moveTo(50, 30); ctx.lineTo(50, 155); ctx.stroke();
    ctx.strokeStyle = colors.blue; ctx.lineWidth = 4; ctx.beginPath(); for (let x = 0; x <= 100; x++) { const d = (x - 50) / 50; const y = 145 - d * d * 105; x === 0 ? ctx.moveTo(50 + x * 6, y) : ctx.lineTo(50 + x * 6, y); } ctx.stroke();
    const px = 350 + (value - 50) * 4.8, py = 145 - Math.pow((value - 50) / 50, 2) * 105; ctx.fillStyle = Math.abs(value - 50) < 7 ? colors.green : colors.orange; ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.ink; ctx.fillText(`偏差 ${Math.round(value - 50)} · 平方惩罚`, 70, 25); return;
  }
  if (mode === 'speed') {
    const channels = Math.round(16 + choice * 48); ctx.fillStyle = colors.muted; ctx.fillText(`特征通道 ${channels}`, 28, 30);
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i < Math.round(channels / 12) ? colors.blue : colors.line; ctx.fillRect(40 + i * 76, 70, 54, 54); }
    ctx.fillStyle = colors.orange; ctx.fillRect(42, 145, Math.min(600, channels * 5), 12); ctx.fillStyle = colors.muted; ctx.fillText('相对计算量示意（非论文计时）', 28, 177); return;
  }
  if (mode === 'receptive') {
    ctx.fillStyle = colors.light; ctx.fillRect(180, 35, 340, 120); ctx.strokeStyle = colors.dark; ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(200 + i * 56, 35); ctx.lineTo(200 + i * 56, 155); ctx.stroke(); }
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(180, 55 + i * 42); ctx.lineTo(520, 55 + i * 42); ctx.stroke(); }
    const k = [1, 3, 5, 9][Math.min(3, Math.floor(choice * 4))], cell = k === 9 ? 95 : k * 17, cx = 350 - cell / 2, cy = 95 - cell / 2; ctx.fillStyle = 'rgba(240,126,71,.28)'; ctx.fillRect(cx, cy, cell, cell); ctx.strokeStyle = colors.orange; ctx.lineWidth = 4; ctx.strokeRect(cx, cy, cell, cell); ctx.fillStyle = colors.ink; ctx.fillText(`${k}×${k} 局部窗口`, 24, 25); return;
  }
  if (mode === 'upscale') {
    const scale = 2 + choice * 2; ctx.fillStyle = colors.light; ctx.fillRect(60, 40, 100, 100); ctx.fillStyle = colors.blue; ctx.fillRect(240, 35, 170, 110); ctx.fillStyle = colors.red; ctx.fillRect(500, 40, 130, 100); ctx.fillStyle = colors.ink; ctx.textAlign = 'center'; ctx.fillText('低分辨率', 110, 165); ctx.fillText(`插值 ×${scale.toFixed(1)}`, 325, 165); ctx.fillText('真实细节未知', 565, 165); ctx.textAlign = 'left'; ctx.strokeStyle = colors.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(164, 90); ctx.lineTo(238, 90); ctx.moveTo(412, 90); ctx.lineTo(498, 90); ctx.stroke(); ctx.fillStyle = colors.orange; const detailCount = Math.max(1, Math.min(5, Math.round(scale))); for (let i = 0; i < detailCount; i++) ctx.fillRect(510 + i * 20, 65, 8, 55); return;
  }
  const prior = Math.round(value / 10); ctx.fillStyle = '#26364d'; ctx.font = 'bold 17px Arial, sans-serif'; ctx.fillText('同一低清图像，可能有不同细节', 26, 28); ctx.fillStyle = colors.blue; ctx.fillRect(60, 68, 250, 52); ctx.fillStyle = '#ffffff'; ctx.font = 'bold 19px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('低清观测', 185, 100); ctx.textAlign = 'left'; [0, 1].forEach((i) => { const x = 390 + i * 135; ctx.fillStyle = i === 0 ? colors.red : colors.green; ctx.fillRect(x, 58, 96, 76); ctx.fillStyle = colors.bg; for (let j = 0; j < 5; j++) if ((j + i + prior) % 2 === 0) ctx.fillRect(x + 10 + j * 16, 72 + (j % 2) * 24, 8, 8); }); ctx.fillStyle = '#26364d'; ctx.font = 'bold 16px Arial, sans-serif'; ctx.fillText('可能细节一', 396, 158); ctx.fillText('可能细节二', 526, 158);
}

export const PaperWidget: React.FC<WidgetProps & { mode: Mode }> = ({ chapterId, moduleId, mode }) => {
  const ref = useRef<HTMLCanvasElement>(null); const [value, setValue] = useState(mode === 'loss' ? 72 : 50); const [choice, setChoice] = useState(1); const [ready, setReady] = useState(false);
  useEffect(() => { const canvas = ref.current; if (!canvas) return; let ctx: CanvasRenderingContext2D; try { ctx = setupCanvas(canvas, W, H); } catch { return; } draw(ctx, mode, value, choice); setReady(true); return observeCanvas(canvas, () => draw(ctx, mode, value, choice), () => {}); }, [mode, value, choice]);
  const labels: Record<Mode, string> = { inference: '卷积位置', pipeline: '方法流程', ambiguity: '先验强度', upscale: '放大倍率', receptive: '窗口尺寸', architecture: '网络层', loss: '预测偏差', speed: '特征通道', results: '测试集', boundary: '结果边界' };
  const feedback = mode === 'inference' ? ['卷积核在不同空间位置复用同一组参数；位置改变，局部响应随之改变。', ''] : mode === 'pipeline' ? [choice < 0.5 ? '传统稀疏编码把环节分开处理；SRCNN 将三层映射联合训练。' : '联合训练让重建目标可以影响整条特征映射。', ''] : mode === 'boundary' ? [choice < 0.5 ? '论文表 1 使用合成双三次退化；真实相机退化不在该表验证范围内。' : '当前状态超出论文表 1 的测试协议，不能沿用其数值结论。', ''] : mode === 'loss' ? [Math.abs(value - 50) < 7 ? '预测接近目标，平方损失较小。' : '预测偏离目标越多，平方损失越大。', Math.abs(value - 50) < 7 ? 'good' : 'bad'] : mode === 'results' ? ['仅展示论文表 1 的 Set5、Set14 ×3 PSNR；数据来自合成双三次退化测试。', ''] : mode === 'ambiguity' ? ['同一低分辨率观测可能对应不同纹理；先验只能偏好候选，不能保证唯一真值。', ''] : mode === 'architecture' ? ['基准结构为 9×9/64、1×1/32、5×5/1；拖动位置可连续聚焦各层。', ''] : mode === 'upscale' ? ['插值网格随倍率变密，但不会补回观测中不存在的真实细节。', ''] : mode === 'speed' ? ['通道数增加通常提高计算量；画面是结构示意，不是论文实测耗时。', ''] : mode === 'receptive' ? ['窗口越大，单次卷积可见的局部范围越大；基准三层组合的感受野为 13×13。', ''] : ['调整状态，观察模型输出与误差如何变化。', ''];
  return <div className="paper-widget"><canvas ref={ref} width={W} height={H} className={ready ? 'is-ready' : ''} aria-label="SRCNN 交互示意" />
    <div className="ctrl"><label>{labels[mode]} <span className="val">{mode === 'architecture' ? ['特征提取', '非线性映射', '重建'][choice] : mode === 'upscale' ? `×${(2 + choice * 2).toFixed(1)}` : mode === 'receptive' ? `${[1, 3, 5, 9][Math.min(3, Math.floor(choice * 4))]}×${[1, 3, 5, 9][Math.min(3, Math.floor(choice * 4))]}` : mode === 'results' ? (choice < 0.5 ? 'Set5' : 'Set14') : mode === 'speed' ? Math.round(16 + choice * 48) : value}</span></label>
      {mode === 'results' ? <input aria-label="选择测试集" type="range" min="0" max="1" step="0.01" value={choice} onChange={e => setChoice(Number(e.target.value))} /> : <input aria-label={labels[mode]} type="range" min={mode === 'loss' || mode === 'ambiguity' ? 0 : 0} max={mode === 'loss' || mode === 'ambiguity' ? 100 : 1} step={0.01} value={mode === 'loss' || mode === 'ambiguity' ? value : choice} onChange={e => mode === 'loss' || mode === 'ambiguity' ? setValue(Number(e.target.value)) : setChoice(Number(e.target.value))} />}
    </div><div className={`feedback ${feedback[1]}`}>{feedback[0]}</div>
  </div>;
};

const modes: Record<string, Mode> = { 'op-inference': 'inference', 'op-pipeline': 'pipeline', 'op-ambiguity': 'ambiguity', 'op-upscale': 'upscale', 'op-receptive': 'receptive', 'op-architecture': 'architecture', 'op-loss': 'loss', 'op-speed': 'speed', 'op-results': 'results', 'op-boundary': 'boundary' };
export const widgetIds = Object.keys(modes);
export function widgetFor(id: string): React.FC<WidgetProps> { const mode = modes[id]; return (props) => <PaperWidget {...props} mode={mode} />; }



export const StaticUpscaleScene: React.FC<WidgetProps> = ({ chapterId, moduleId }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    let ctx: CanvasRenderingContext2D; try { ctx = setupCanvas(canvas, 560, 140); } catch { return; }
    ctx.clearRect(0, 0, 560, 140); ctx.fillStyle = '#f5f8f0'; ctx.fillRect(0, 0, 560, 140);
    ctx.fillStyle = '#b8c9a7'; ctx.fillRect(44, 28, 76, 76);
    ctx.fillStyle = '#27446e'; ctx.fillRect(224, 24, 112, 84);
    ctx.fillStyle = '#c43f52'; ctx.fillRect(440, 28, 78, 76);
    ctx.strokeStyle = '#d7deea'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(122, 66); ctx.lineTo(218, 66); ctx.moveTo(342, 66); ctx.lineTo(434, 66); ctx.stroke();
    ctx.fillStyle = '#21324a'; ctx.font = 'bold 15px Arial, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('低分辨率图像', 82, 128); ctx.fillText('插值放大', 280, 128); ctx.fillText('细节仍未知', 479, 128);
    canvas.classList.add('is-ready');
  }, [chapterId, moduleId]);
  return <canvas ref={ref} width={560} height={140} aria-label="低分辨率图像插值放大的静态示意" />;
};

export const StaticPipelineScene: React.FC<WidgetProps & { mode: 'old' | 'new' }> = ({ mode }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    let ctx: CanvasRenderingContext2D; try { ctx = setupCanvas(canvas, 560, 140); } catch { return; }
    ctx.clearRect(0, 0, 560, 140); ctx.fillStyle = '#f5f8f0'; ctx.fillRect(0, 0, 560, 140);
    const old = mode === 'old';
    const labels = old ? ['预处理', '稀疏编码', '字典重建', '块融合'] : ['特征提取', '非线性映射', '图像重建'];
    const xs = old ? [18, 155, 292, 429] : [34, 208, 382];
    const bw = old ? 104 : 142;
    labels.forEach((label, i) => {
      const x = xs[i]; ctx.fillStyle = '#b8c9a7'; ctx.fillRect(x, 38, bw, 48);
      ctx.strokeStyle = '#76906a'; ctx.lineWidth = 1.5; ctx.strokeRect(x, 38, bw, 48);
      ctx.fillStyle = '#21324a'; ctx.font = 'bold 13px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, x + bw / 2, 67);
      if (i < labels.length - 1) { ctx.strokeStyle = '#9eacc0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + bw + 3, 62); ctx.lineTo(xs[i + 1] - 6, 62); ctx.stroke(); }
    });
    ctx.textAlign = 'center'; ctx.fillStyle = '#26364d'; ctx.font = 'bold 13px Arial, sans-serif';
    ctx.fillText(old ? '环节分开设计' : '各层共同优化', 280, 116); canvas.classList.add('is-ready');
  }, [mode]);
  return <canvas ref={ref} width={560} height={140} aria-label={mode === 'old' ? '传统分步超分辨率流程' : 'SRCNN 三层网络流程'} />;
};
