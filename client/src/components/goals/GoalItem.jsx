import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Card, Input } from '../ui';

const GoalItem = ({ goal, index, updateGoal, removeGoal, thrustAreas, uoms }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="relative border-l-4 border-l-primary-500">
        <div className="absolute -left-3 top-8 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
          {index + 1}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-6">
            <Input 
              label="Goal Title"
              placeholder="e.g., Increase regional sales by 20%"
              value={goal.title}
              onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
            />
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Description (Optional)</label>
              <textarea 
                rows="3"
                placeholder="Briefly describe the key actions and expected outcome..."
                className="input-field dark:bg-slate-800/50 resize-none"
                value={goal.description}
                onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Thrust Area</label>
                <select 
                  className="input-field dark:bg-slate-800/50 appearance-none"
                  value={goal.thrustArea}
                  onChange={(e) => updateGoal(goal.id, 'thrustArea', e.target.value)}
                >
                  <option value="">Select Area</option>
                  {thrustAreas.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">UOM</label>
                <select 
                  className="input-field dark:bg-slate-800/50 appearance-none"
                  value={goal.uom}
                  onChange={(e) => updateGoal(goal.id, 'uom', e.target.value)}
                >
                  {uoms.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Target Value"
                type="number"
                value={goal.target}
                onChange={(e) => updateGoal(goal.id, 'target', e.target.value)}
              />
              <Input 
                label="Weightage (%)"
                type="number"
                min="10"
                error={goal.weightage < 10 ? 'Minimum 10% required' : null}
                value={goal.weightage}
                onChange={(e) => updateGoal(goal.id, 'weightage', e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => removeGoal(goal.id)}
                className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold"
              >
                <Trash2 size={16} />
                <span>Delete Goal</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GoalItem;
