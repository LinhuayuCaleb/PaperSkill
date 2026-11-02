import React from 'react';
import { ExampleSlider } from './exampleSlider';
import { SrcnnExplore } from './srcnn-explore';
import { PaperWidget, StaticPipelineScene, StaticUpscaleScene } from './paperWidgets';
const AnalogyCanvas: React.FC<WidgetProps> = (p) => <StaticUpscaleScene {...p} />;
const OldCanvas: React.FC<WidgetProps> = (p) => <StaticPipelineScene {...p} mode="old" />;
const NewCanvas: React.FC<WidgetProps> = (p) => <StaticPipelineScene {...p} mode="new" />;

export interface WidgetProps {
  chapterId: string;
  moduleId: string;
}

export const widgetRegistry: Record<string, React.FC<WidgetProps>> = {};
widgetRegistry['example-slider'] = ExampleSlider;
widgetRegistry['srcnn-explore'] = SrcnnExplore;
widgetRegistry['op-ambiguity'] = (p) => <PaperWidget {...p} mode="ambiguity" />;
widgetRegistry['op-upscale'] = (p) => <PaperWidget {...p} mode="upscale" />;
widgetRegistry['op-receptive'] = (p) => <PaperWidget {...p} mode="receptive" />;
widgetRegistry['op-architecture'] = (p) => <PaperWidget {...p} mode="architecture" />;
widgetRegistry['op-loss'] = (p) => <PaperWidget {...p} mode="loss" />;
widgetRegistry['op-speed'] = (p) => <PaperWidget {...p} mode="speed" />;
widgetRegistry['op-results'] = (p) => <PaperWidget {...p} mode="results" />;
widgetRegistry['op-boundary'] = (p) => <PaperWidget {...p} mode="boundary" />;
widgetRegistry['analogy-canvas'] = AnalogyCanvas;
widgetRegistry['hero-old'] = OldCanvas;
widgetRegistry['hero-new'] = NewCanvas;

widgetRegistry['op-pipeline'] = (p) => <PaperWidget {...p} mode="pipeline" />;
widgetRegistry['op-inference'] = (p) => <PaperWidget {...p} mode="inference" />;
