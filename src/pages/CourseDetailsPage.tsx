
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { getCourseById, getCollegesByIds, getCareersForCourse } from '@/utils/dataUtils';
import StarRating from '@/components/StarRating';

const CourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (courseId) {
      const foundCourse = getCourseById(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        
        // Get colleges that offer this course
        if (foundCourse.topCollegeIds && foundCourse.topCollegeIds.length > 0) {
          setColleges(getCollegesByIds(foundCourse.topCollegeIds));
        }
        
        // Get career options for this course
        const relatedCareers = getCareersForCourse(courseId);
        setCareers(relatedCareers);
      }
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <AnimatedTransition>
          <div className="mb-6">
            <Link
              to="/courses"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to courses
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6 glass-panel shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl md:text-3xl font-bold">{course.name}</CardTitle>
                      <CardDescription className="text-lg mt-2">{course.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-sm px-3 py-1 border-primary/30">
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">
                        {course.duration} {course.durationType}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{course.qualification}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{course.jobProspects} job prospects</span>
                    </div>
                    <div className="flex items-center">
                      <StarRating rating={course.rating || 4} size="sm" />
                      <span className="text-sm ml-2">{course.rating || 4}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="colleges">Colleges</TabsTrigger>
                  <TabsTrigger value="careers">Career Paths</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <Card className="glass-panel shadow-lg">
                    <CardHeader>
                      <CardTitle>Course Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p>{course.fullDescription || course.description}</p>
                      </div>

                      {course.curriculum && course.curriculum.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Curriculum Highlights</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {course.curriculum.map((item: string, index: number) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {course.requirements && (
                        <div>
                          <h3 className="font-medium mb-2">Entry Requirements</h3>
                          <p>{course.requirements}</p>
                        </div>
                      )}

                      <div className="career-prospects">
                        <h3 className="font-medium mb-2">Career Prospects</h3>
                        <p className="text-foreground">
                          This course opens doors to various opportunities including roles like
                          {careers.length > 0
                            ? careers.slice(0, 3).map((career) => career.title).join(", ")
                            : " industry specialist, consultant, and researcher"}
                          , with an average starting salary of approximately {course.averageSalary || "$45,000-$65,000"}.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full sm:w-auto">
                        <MessageSquare className="mr-2 h-4 w-4" /> Ask about this course
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="colleges" className="mt-0">
                  <Card className="glass-panel shadow-lg">
                    <CardHeader>
                      <CardTitle>Colleges offering {course.name}</CardTitle>
                      <CardDescription>
                        {colleges.length} colleges found that offer this course
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                          {colleges.length > 0 ? (
                            colleges.map((college) => (
                              <Card key={college.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                  <Link to={`/colleges/${college.id}`}>
                                    <CardTitle className="text-lg hover:text-primary transition-colors">
                                      {college.name}
                                    </CardTitle>
                                  </Link>
                                  <CardDescription>{college.location}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 pb-4">
                                  <div className="flex items-center mb-2">
                                    <StarRating rating={college.rating || 4} size="sm" />
                                    <span className="text-sm ml-2">{college.ranking || "Top 100"} Ranking</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {college.description?.substring(0, 100)}...
                                  </p>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p>No colleges found that offer this course.</p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="careers" className="mt-0">
                  <Card className="glass-panel shadow-lg">
                    <CardHeader>
                      <CardTitle>Career Paths</CardTitle>
                      <CardDescription>Potential careers after {course.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-4">
                          {careers.length > 0 ? (
                            careers.map((career) => (
                              <Card key={career.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                  <Link to={`/careers/${career.id}`}>
                                    <CardTitle className="text-lg hover:text-primary transition-colors">
                                      {career.title}
                                    </CardTitle>
                                  </Link>
                                  <CardDescription>{career.field}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 pb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {career.salaryRange?.india || career.averageSalary}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {career.growthOutlook || career.growthRate}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {career.description?.substring(0, 100)}...
                                  </p>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <p>No specific career paths found for this course.</p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View all careers</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card className="glass-panel shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Key Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-1">Duration</h3>
                    <p>{course.duration} {course.durationType}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Qualification</h3>
                    <p>{course.qualification}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Level</h3>
                    <p>{course.level}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Study Mode</h3>
                    <p>{course.studyMode || "Full-time / Part-time"}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Tuition Fees</h3>
                    <p>{course.tuitionFees || "Varies by college"}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Enquire Now</Button>
                </CardFooter>
              </Card>

              <Card className="glass-panel shadow-lg">
                <CardHeader>
                  <CardTitle>Similar Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/courses/another-course-1">Advanced Course in {course.field}</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/courses/another-course-2">Specialized {course.name}</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/courses/another-course-3">Professional Training in {course.field}</Link>
                  </Button>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/courses">Browse all courses</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default CourseDetailsPage;
