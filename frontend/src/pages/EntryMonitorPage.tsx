import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { monitoringService } from '../services/api';
import { MonitoringSession } from '../types';
import { Compass, Play, Pause, Trash2, Plus, Bell, Target, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EntryMonitorPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('RELIANCE');
  const [newIntent, setNewIntent] = useState(25000);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['monitoring'],
    queryFn: monitoringService.getSessions,
    refetchInterval: 15000,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      monitoringService.createSession({
        symbol: newSymbol,
        investment_intent: newIntent,
        target_strategy: 'VWAP-based zone',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring'] });
      setShowNewModal(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      monitoringService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['monitoring'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => monitoringService.deleteSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['monitoring'] }),
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-subtleBorder">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">SmartEntry Monitor</h1>
          <p className="text-xs text-brand-muted font-mono mt-0.5">
            Real-Time Advisory Surveillance: Dynamic Entry Zones & Volume Confirmation
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-3.5 py-2 rounded-md bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(40,123,255,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" /> Start New Monitor Session
        </button>
      </div>

      {/* Advisory Notice */}
      <div className="p-3.5 rounded-lg bg-[#0F131C] border border-[#287BFF]/30 text-xs text-zinc-300 flex items-start gap-3">
        <Compass className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white font-mono">ADVISORY SURVEILLANCE ONLY:</strong> SmartEntry continuously monitors whether target stocks retrace into their preferred institutional VWAP zones. No automated broker orders are executed.
        </p>
      </div>

      {/* Active Sessions Grid */}
      {sessions.length === 0 ? (
        <div className="bg-card border border-subtleBorder rounded-lg p-12 text-center flex flex-col items-center justify-center gap-3">
          <Compass className="w-10 h-10 text-brand-muted opacity-40" />
          <h3 className="text-sm font-semibold text-white">No Active Entry Monitoring Sessions</h3>
          <p className="text-xs text-brand-muted max-w-sm">
            Launch an advisory monitoring session for your preferred stock to receive immediate notifications when price enters the optimal VWAP zone.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="mt-2 px-3 py-1.5 rounded bg-accent-blue text-white text-xs font-medium"
          >
            Create Session Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-card border border-subtleBorder hover:border-[#323B4C] rounded-lg p-4 flex flex-col justify-between gap-4 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => navigate(`/stocks/${session.symbol}`)}
                        className="font-mono font-bold text-white text-base hover:text-accent-blue cursor-pointer transition-colors"
                      >
                        {session.symbol}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          session.status === 'Entry conditions met'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 animate-pulse'
                            : session.status === 'Paused'
                            ? 'bg-zinc-800 text-zinc-400'
                            : 'bg-blue-950 text-accent-blue border border-accent-blue/30'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-brand-muted">
                      Intent: ₹{session.investment_intent.toLocaleString('en-IN')} • {session.target_strategy}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {session.status === 'Monitoring' ? (
                      <button
                        onClick={() => statusMutation.mutate({ id: session.id, status: 'Paused' })}
                        title="Pause Monitoring"
                        className="p-1.5 rounded hover:bg-[#1B212D] text-brand-muted hover:text-white"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => statusMutation.mutate({ id: session.id, status: 'Monitoring' })}
                        title="Resume Monitoring"
                        className="p-1.5 rounded hover:bg-[#1B212D] text-emerald-400 hover:text-emerald-300"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(session.id)}
                      title="Stop & Delete"
                      className="p-1.5 rounded hover:bg-rose-950/40 text-brand-muted hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pricing and Target Zone metrics */}
                <div className="mt-4 p-3 bg-[#0F131C] rounded border border-subtleBorder grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>
                    <span className="text-brand-muted text-[10px] block uppercase">Current Price</span>
                    <span className="font-bold text-white">
                      ₹{session.current_price?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-muted text-[10px] block uppercase">Target Entry Zone</span>
                    <span className="font-semibold text-emerald-400">
                      ₹{session.lower_zone?.toFixed(2)} – ₹{session.upper_zone?.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-muted text-[10px] block uppercase">AI Entry Score</span>
                    <span className="font-bold text-accent-blue">{session.last_score || 0}/100</span>
                  </div>
                </div>

                {/* Alerts Log */}
                {session.alerts && session.alerts.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-brand-muted block">
                      Recent Activity & Alerts
                    </span>
                    {session.alerts.slice(0, 2).map((a) => (
                      <div
                        key={a.id}
                        className="p-2 rounded bg-[#141A26] border border-subtleBorder/70 text-[11px] text-zinc-300 flex items-start gap-2"
                      >
                        <Bell className="w-3.5 h-3.5 text-accent-blue shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-white">{a.title}</div>
                          <div className="text-zinc-400 leading-tight">{a.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-subtleBorder flex items-center justify-between text-[11px] font-mono text-brand-muted">
                <span>Updated: {new Date(session.updated_at).toLocaleTimeString()}</span>
                <button
                  onClick={() => navigate(`/stocks/${session.symbol}`)}
                  className="text-accent-blue hover:underline flex items-center gap-1"
                >
                  Full Analysis <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating a new session */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-card border border-subtleBorder rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white">Start SmartEntry Monitoring</h3>
            <p className="text-xs text-brand-muted mt-1 font-mono">
              Configure parameters for advisory zone tracking
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">STOCK SYMBOL</label>
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. RELIANCE, TCS, INFY"
                  className="w-full bg-[#090B10] border border-subtleBorder rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  INTENDED CAPITAL ALLOCATION (₹ INR)
                </label>
                <input
                  type="number"
                  value={newIntent}
                  onChange={(e) => setNewIntent(Number(e.target.value))}
                  className="w-full bg-[#090B10] border border-subtleBorder rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-accent-blue"
                />
              </div>

              <div className="p-3 bg-[#0F131C] rounded border border-subtleBorder text-[11px] text-zinc-400">
                The platform will automatically calculate the institutional VWAP and ATR boundary to set the preferred accumulation band.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending}
                  className="px-4 py-2 rounded bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold"
                >
                  {createMutation.isPending ? 'Activating...' : 'Activate Surveillance'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
