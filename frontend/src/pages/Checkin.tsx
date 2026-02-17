import { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { useCheckin } from '../hooks/useCheckin';
import { MoodPicker } from '../components/checkin/MoodPicker';
import { QuestionCard } from '../components/checkin/QuestionCard';
import { RevealCard } from '../components/checkin/RevealCard';
import { MoodCalendar } from '../components/checkin/MoodCalendar';
import { MoodTrends } from '../components/checkin/MoodTrends';
import { Loader2, Send, Clock, History, TrendingUp } from 'lucide-react';

export const Checkin = () => {
  const {
    question,
    myCheckin,
    partnerCheckin,
    partnerCompleted,
    bothCompleted,
    history,
    isLoading,
    error,
    submitCheckin,
    fetchHistory,
  } = useCheckin();

  const [mood, setMood] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<'today' | 'history' | 'trends'>('today');

  useEffect(() => {
    if (view === 'history' && history.length === 0) {
      fetchHistory(30);
    }
  }, [view, history.length, fetchHistory]);

  const handleSubmit = async () => {
    if (!mood || !answer.trim()) return;
    setSubmitting(true);
    try {
      await submitCheckin(mood, answer.trim());
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && !question) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-app py-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Daily Check-in</h1>
          <div className="flex gap-1">
            <button
              onClick={() => setView(view === 'trends' ? 'today' : 'trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'trends' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Trends
            </button>
            <button
              onClick={() => setView(view === 'history' ? 'today' : 'history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'history' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        {view === 'today' && (
          <div className="space-y-5">
            {/* State 3: Both completed — reveal */}
            {bothCompleted && myCheckin && partnerCheckin && question && (
              <>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-sm font-medium text-green-700">Both checked in! Here are your answers:</p>
                </div>
                <RevealCard question={question} myCheckin={myCheckin} partnerCheckin={partnerCheckin} />
              </>
            )}

            {/* State 2: Submitted, waiting for partner */}
            {myCheckin && !bothCompleted && (
              <div className="text-center space-y-4">
                <div className="bg-primary-50 rounded-xl p-6">
                  <Clock className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-900 mb-1">You've checked in!</p>
                  <p className="text-sm text-gray-600">Waiting for your partner to complete theirs...</p>
                </div>
                {question && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 text-left">
                    <p className="text-xs text-gray-500 mb-2">Your answer to: {question.text}</p>
                    <p className="text-sm text-gray-800">{myCheckin.answer}</p>
                  </div>
                )}
              </div>
            )}

            {/* State 1: Not yet submitted */}
            {!myCheckin && question && (
              <>
                {partnerCompleted && (
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-sm font-medium text-pink-700">
                      Your partner has checked in! Complete yours to see their answers
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">How are you feeling?</p>
                  <MoodPicker selected={mood} onSelect={setMood} />
                </div>

                <QuestionCard
                  question={question}
                  answer={answer}
                  onAnswerChange={setAnswer}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!mood || !answer.trim() || submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Check-in
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {view === 'trends' && <MoodTrends />}

        {view === 'history' && <MoodCalendar entries={history} />}
      </div>
    </Layout>
  );
};
