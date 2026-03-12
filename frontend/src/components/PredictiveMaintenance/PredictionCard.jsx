import React from 'react';
import { Card, Badge, Button } from '../ui';
import { AlertTriangle, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

function PredictionCard({ prediction, onViewDetails }) {
  const getRiskColor = (level) => {
    switch(level) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default: return 'bg-green-500/20 text-green-400 border-green-500';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 80) return 'text-green-400';
    if (confidence > 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="hover:shadow-lg transition-all">
      <Card.Body>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{prediction.registration}</h3>
            <p className="text-sm text-gray-400">Risk Score: {prediction.riskScore}</p>
          </div>
          <div className={`px-3 py-1 rounded-full border ${getRiskColor(prediction.riskLevel)}`}>
            {prediction.riskLevel}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-sm text-gray-300">
              Next maintenance in <span className="font-bold text-white">{prediction.predictedDaysUntilMaintenance} days</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-400" />
            <span className="text-sm text-gray-300">
              Confidence: <span className={`font-bold ${getConfidenceColor(prediction.confidence)}`}>
                {prediction.confidence}%
              </span>
            </span>
          </div>

          {prediction.predictedFailureType && (
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-yellow-400 mt-1" />
              <div>
                <p className="text-sm text-gray-300">Likely failure: <span className="font-bold text-white">{prediction.predictedFailureType}</span></p>
                {prediction.alternativeFailureTypes?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Alternatives: {prediction.alternativeFailureTypes.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 pt-3">
          <p className="text-sm text-gray-400 mb-3">{prediction.recommendations?.[0]}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewDetails(prediction)}
            icon={ArrowRight}
            className="w-full justify-center"
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PredictionCard;
