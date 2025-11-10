'use client';

import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEmployees } from '@/data';
import { Star, Quote, Briefcase, Award, ThumbsUp } from 'lucide-react';

export default function ReviewsPage() {
  // Using first employee as the logged-in user
  const currentEmployee = mockEmployees[0];

  // Combine reviews and recommendations
  const allTestimonials = useMemo(() => {
    const reviewItems = currentEmployee.reviews.map(r => ({
      id: r.id,
      name: r.reviewerName,
      position: r.reviewerPosition,
      company: r.reviewerCompany,
      rating: r.rating,
      text: r.comment,
      relationship: 'colleague', // Reviews don't have relationship, default to colleague
      date: r.date,
      highlights: r.skills,
    }));

    const recommendationItems = currentEmployee.recommendations.map(r => ({
      id: r.id,
      name: r.recommenderName,
      position: r.recommenderPosition,
      company: r.recommenderCompany,
      rating: 5, // Recommendations are always positive
      text: r.text,
      relationship: r.relationship.toLowerCase().replace(' ', '_'),
      date: r.date,
      highlights: [] as string[],
    }));

    return [...reviewItems, ...recommendationItems].sort((a, b) =>
      b.date.getTime() - a.date.getTime()
    );
  }, [currentEmployee.reviews, currentEmployee.recommendations]);

  // Calculate review statistics
  const stats = useMemo(() => {
    const reviewsWithRating = allTestimonials.filter(t => t.rating > 0);
    const totalReviews = allTestimonials.length;
    const avgRating = reviewsWithRating.length > 0
      ? (reviewsWithRating.reduce((sum, r) => sum + r.rating, 0) / reviewsWithRating.length).toFixed(1)
      : '0.0';

    const ratingDistribution = {
      5: reviewsWithRating.filter(r => r.rating === 5).length,
      4: reviewsWithRating.filter(r => r.rating === 4).length,
      3: reviewsWithRating.filter(r => r.rating === 3).length,
      2: reviewsWithRating.filter(r => r.rating === 2).length,
      1: reviewsWithRating.filter(r => r.rating === 1).length,
    };

    // Count by relationship type
    const byType = {
      colleague: allTestimonials.filter(r => r.relationship.includes('colleague')).length,
      manager: allTestimonials.filter(r => r.relationship.includes('manager')).length,
      direct_report: allTestimonials.filter(r => r.relationship.includes('direct_report')).length,
      client: allTestimonials.filter(r => r.relationship.includes('client')).length,
    };

    return { totalReviews, avgRating, ratingDistribution, byType };
  }, [allTestimonials]);

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case 'colleague': return 'Colleague';
      case 'manager': return 'Manager';
      case 'direct_report': return 'Direct Report';
      case 'client': return 'Client';
      default: return relationship;
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'colleague': return 'bg-blue-100 text-blue-800';
      case 'direct_report': return 'bg-green-100 text-green-800';
      case 'client': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-graphite mb-2">Reviews & Recommendations</h1>
          <p className="text-xl text-slate">
            See what others have said about working with you
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate flex items-center gap-2">
                <Star className="h-4 w-4" />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-graphite">{stats.avgRating}</div>
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(parseFloat(stats.avgRating)) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate flex items-center gap-2">
                <Quote className="h-4 w-4" />
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-graphite">{stats.totalReviews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                From Managers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.byType.manager}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                From Colleagues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.byType.colleague}</div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of your review ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <span className="font-medium">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    </div>
                    <div className="flex-1 h-4 bg-mist-blue rounded-full overflow-hidden">
                      <div
                        className="h-full bg-glacier-dark transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-16 text-sm text-slate text-right">
                      {count} {count === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-graphite">All Reviews & Recommendations</h2>

          {allTestimonials.map((testimonial, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-glacier-dark to-lavender-dark flex items-center justify-center text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{testimonial.name}</CardTitle>
                      <CardDescription>
                        {testimonial.position} at {testimonial.company}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getRelationshipColor(testimonial.relationship)}>
                          {getRelationshipLabel(testimonial.relationship)}
                        </Badge>
                        <span className="text-xs text-slate" suppressHydrationWarning>
                          {new Date(testimonial.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {testimonial.rating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-1 h-8 w-8 text-mist-blue opacity-50" />
                  <p className="text-slate text-base leading-relaxed pl-8">
                    {testimonial.text}
                  </p>
                </div>

                {/* Highlights */}
                {testimonial.highlights && testimonial.highlights.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-mist-blue">
                    <h4 className="text-sm font-semibold text-graphite mb-2 flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Key Strengths Mentioned
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {testimonial.highlights.map((highlight, hIdx) => (
                        <Badge key={hIdx} variant="secondary" className="bg-glacier/30">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {allTestimonials.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-slate">Reviews and recommendations from colleagues and managers will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
