import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
const swarmData = [
  { name: 'GPT-4o', x: 100, y: 200, z: 200, type: 'model', fill: '#818cf8' },
  { name: 'Gemini 2.5', x: 300, y: 300, z: 150, type: 'model', fill: '#6366f1' },
  { name: 'clink', x: 200, y: 100, z: 100, type: 'tool', fill: '#f59e0b' },
  { name: 'planner', x: 400, y: 150, z: 120, type: 'tool', fill: '#f472b6' },
  { name: 'User', x: 250, y: 450, z: 250, type: 'user', fill: '#34d399' },
];
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-md text-xs text-zinc-200">
        <p className="font-bold">{data.name}</p>
        <p>Type: <span className="capitalize">{data.type}</span></p>
      </div>
    );
  }
  return null;
};
export function VisualContextGraph() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 10, left: -20 }}
        >
          <XAxis type="number" dataKey="x" name="x" tick={false} axisLine={false} />
          <YAxis type="number" dataKey="y" name="y" tick={false} axisLine={false} />
          <ZAxis type="number" dataKey="z" range={[50, 500]} name="size" />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Agent Swarm" data={swarmData} shape="circle">
            {swarmData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} className="transition-opacity hover:opacity-80" />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}