import React, { useState, useEffect } from 'react';
import { Card, Button, useToast, LoadingSpinner, Tabs } from '../ui';
import PredictionCard from './PredictionCard';
import { Brain, AlertTriangle, Activity, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function FleetRiskDashboard() {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [summary, setSummary] = useState({ total: 0, critical: 0, medium: 0, low: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/predictions/fleet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPredictions(response.data.data);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
      toast.error('Failed to load predictive maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const trainModel = async () => {
    try {
      toast.info('Training AI model... This may take a moment');
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/predictions/train', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Model trained successfully!');
        fetchPredictions();
      }
    } catch (error) {
      console.error('Failed to train model:', error);
      toast.error('Failed to train model');
    }
  };

  const getFilteredPredictions = () => {
    if (activeTab === 'all') return predictions;
    return predictions.filter(p => p.riskLevel.toLowerCase() === activeTab);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Brain className="text-purple-400" size={28} />
          <h2 className="text-2xl font-bold text-white">AI Predictive Maintenance</h2>
        </div>
        <div className="flex gap-3">
          {user?.role === 'admin' && (
            <Button variant="secondary" size="sm" onClick={trainModel} icon={RefreshCw}>
              Train Model
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={fetchPredictions} icon={Activity}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Total Aircraft</p>
            <p className="text-2xl font-bold text-white">{summary.total}</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Critical Risk</p>
            <p className="text-2xl font-bold text-red-400">{summary.critical}</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Medium Risk</p>
            <p className="text-2xl font-bold text-yellow-400">{summary.medium}</p>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <p className="text-gray-400 text-sm">Low Risk</p>
            <p className="text-2xl font-bold text-green-400">{summary.low}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Risk Alert */}
      {summary.critical > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-500 font-medium">
              {summary.critical} aircraft require immediate attention
            </p>
            <p className="text-sm text-red-400/80 mt-1">
              Schedule maintenance within 7 days to prevent potential failures.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'all', label: 'All Aircraft', badge: predictions.length },
          { id: 'critical', label: 'Critical', badge: summary.critical },
          { id: 'medium', label: 'Medium', badge: summary.medium },
          { id: 'low', label: 'Low', badge: summary.low }
        ]}
        defaultTab="all"
        onChange={setActiveTab}
        variant="pills"
      />

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredPredictions().map((prediction) => (
          <PredictionCard
            key={prediction.aircraftId}
            prediction={prediction}
            onViewDetails={(p) => {
              toast.info(`Viewing details for ${p.registration}`);
              // Navigate to aircraft detail with prediction tab
            }}
          />
        ))}
      </div>

      {getFilteredPredictions().length === 0 && (
        <Card>
          <Card.Body className="text-center py-12">
            <Activity size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No predictions found for this category</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default FleetRiskDashboard;
