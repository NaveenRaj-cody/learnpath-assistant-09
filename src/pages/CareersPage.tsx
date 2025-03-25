import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { coursesData } from '@/data/coursesData';
import { BriefcaseIcon, Globe, MapPin, Building, Search, Banknote, LineChart, Newspaper, Users, Calendar, ArrowUpRight, X } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import SearchableSelect from '@/components/SearchableSelect';
import { SubjectArea } from '@/types/filters';

const newsData = [
  {
    id: 1,
    title: "New Tech Jobs Surge in AI and Machine Learning Sectors",
    date: "2023-10-15",
    source: "Tech Career Daily",
    snippet: "Companies worldwide are investing heavily in AI talent with salaries increasing by 25% on average.",
    tag: "technology"
  },
  {
    id: 2,
    title: "Healthcare Professionals in High Demand Globally",
    date: "2023-10-10",
    source: "Medical Career Network",
    snippet: "Post-pandemic healthcare systems are facing staffing shortages with opportunities for international professionals.",
    tag: "healthcare"
  },
  {
    id: 3,
    title: "Remote Work Reshaping Global Engineering Jobs",
    date: "2023-10-05",
    source: "Engineering Today",
    snippet: "Companies are hiring engineers from around the world as remote work becomes the new normal.",
    tag: "engineering"
  },
  {
    id: 4,
    title: "Business Analysts Crucial for Digital Transformation",
    date: "2023-09-28",
    source: "Business Trends Weekly",
    snippet: "Organizations seeking skilled analysts to navigate complex digital landscapes and strategy shifts.",
    tag: "business"
  },
  {
    id: 5,
    title: "Creative Industry Rebounds with New Opportunities",
    date: "2023-09-20",
    source: "Creative Careers Magazine",
    snippet: "Design, media, and content creation roles expanding as companies invest in digital presence.",
    tag: "arts"
  }
];

const careerSalaryData: Record<string, { india: string, global: string }> = {
  "Software Developer": { india: "₹5-20 LPA", global: "$60K-150K/year" },
  "Systems Analyst": { india: "₹4-15 LPA", global: "$55K-120K/year" },
  "Data Scientist": { india: "₹8-25 LPA", global: "$80K-160K/year" },
  "Web Developer": { india: "₹3-18 LPA", global: "$50K-130K/year" },
  "AI Engineer": { india: "₹10-30 LPA", global: "$90K-180K/year" },
  "General Physician": { india: "₹12-40 LPA", global: "$150K-300K/year" },
  "Surgeon": { india: "₹20-80 LPA", global: "$200K-500K/year" },
  "Medical Researcher": { india: "₹8-25 LPA", global: "$70K-150K/year" },
  "Public Health Specialist": { india: "₹7-20 LPA", global: "$60K-140K/year" },
  "Medical Officer": { india: "₹6-25 LPA", global: "$80K-200K/year" },
  "Business Analyst": { india: "₹6-18 LPA", global: "$65K-130K/year" },
  "Marketing Executive": { india: "₹4-15 LPA", global: "$50K-120K/year" },
  "Human Resources Manager": { india: "₹5-20 LPA", global: "$60K-140K/year" },
  "Operations Manager": { india: "₹8-25 LPA", global: "$70K-150K/year" },
  "Entrepreneur": { india: "Variable", global: "Variable" },
};

const defaultSalary = { india: "₹5-15 LPA", global: "$60K-120K/year" };

const CareersPage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<SubjectArea>('all');
  const [newsFilter, setNewsFilter] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);
  
  const allCourses = coursesData.map(course => ({
    id: course.id,
    name: course.name,
    field: course.field
  }));
  
  // Generate career options for searchable select
  const careerOptions = React.useMemo(() => {
    const allCareers = new Set<string>();
    
    coursesData.forEach(course => {
      course.careerProspects.forEach(career => {
        allCareers.add(career);
      });
    });
    
    return Array.from(allCareers).map(career => ({
      value: career,
      label: career
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, []);
  
  // Generate course options for searchable select
  const courseOptions = allCourses
    .filter(course => selectedField === 'all' || course.field === selectedField)
    .map(course => ({
      value: course.id,
      label: course.name
    }));
  
  const uniqueFields = [...new Set(coursesData.map(course => course.field))];
  
  const filteredCareers = coursesData
    .filter(course => 
      (selectedField === 'all' || course.field === selectedField)
    )
    .flatMap(course => course.careerProspects.map(career => ({
      career,
      course: course.name,
      field: course.field
    })))
    .filter(item => {
      if (searchTerm === '') return true;
      return item.career === searchTerm;
    });
  
  const filteredNews = newsData.filter(news => 
    newsFilter === 'all' || news.tag === newsFilter
  );

  const handleViewCareerDetails = (career: string) => {
    setSelectedCareer(career);
    setIsCareerDialogOpen(true);
  };

  const subjectAreaOptions: { value: SubjectArea; label: string }[] = [
    { value: 'all', label: 'All Fields' },
    { value: 'arts', label: 'Arts/Humanities' },
    { value: 'science', label: 'Science' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'engineering', label: 'Engineering/Technology' },
    { value: 'medicine', label: 'Medicine/Allied Health Sciences' },
    { value: 'law', label: 'Law' },
    { value: 'design', label: 'Design/Architecture' },
    { value: 'computer-applications', label: 'Computer Applications' },
    { value: 'hotel-management', label: 'Hotel Management' },
    { value: 'management', label: 'Management' },
    { value: 'social-sciences', label: 'Social Sciences' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'education', label: 'Education' },
    { value: 'information-technology', label: 'Information Technology' },
    { value: 'paramedical', label: 'Paramedical' },
    { value: 'vocational', label: 'Vocational' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'media', label: 'Media' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'others', label: 'Others' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <AnimatedTransition>
          <h1 className="text-3xl font-bold mb-8 text-gradient">Career Opportunities</h1>
          
          <div className="mb-8">
            <Tabs defaultValue={selectedRegion} onValueChange={setSelectedRegion} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="global" className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>Global</span>
                  </TabsTrigger>
                  <TabsTrigger value="india" className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>India</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <Card className="mb-6 glass-panel">
                <CardHeader>
                  <CardTitle className="text-xl">Filter Career Opportunities</CardTitle>
                  <CardDescription>Find the perfect career path based on your interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search Careers</label>
                      <SearchableSelect
                        options={careerOptions}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        placeholder="Search careers"
                        className="glass-input"
                        searchPlaceholder="Type to search careers..."
                        noResultsText="No careers found"
                        renderAsInput={true}
                        popoverWidth="w-[300px] md:w-[400px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Field of Study</label>
                      <SearchableSelect
                        options={subjectAreaOptions}
                        value={selectedField}
                        onValueChange={(value) => {
                          setSelectedField(value as SubjectArea);
                          setNewsFilter(value); // Update news filter to match field
                        }}
                        placeholder="Select field"
                        className="glass-input"
                        noResultsText="No fields found"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedField('all');
                        setNewsFilter('all');
                      }}
                      className="text-sm"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-primary" />
                    Career Opportunities {selectedRegion === 'india' ? 'in India' : 'Worldwide'}
                  </h2>
                  
                  {filteredCareers.length === 0 ? (
                    <Card className="p-8 text-center mb-6">
                      <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No careers found</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {filteredCareers.map((item, index) => {
                        const salaryInfo = careerSalaryData[item.career] || defaultSalary;
                        return (
                          <Card key={index} className="flex flex-col h-full hover:border-primary transition-colors glass-panel">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{item.career}</CardTitle>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  {item.field}
                                </Badge>
                              </div>
                              <CardDescription>Based on {item.course}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2 flex-grow">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{selectedRegion === 'india' ? salaryInfo.india : salaryInfo.global}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <LineChart className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>Growth: High</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>
                                    {selectedRegion === 'india' 
                                      ? 'Major Cities' 
                                      : 'Global Markets'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>Multiple Industries</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="mt-auto">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleViewCareerDetails(item.career)}
                              >
                                View Details
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Newspaper className="h-5 w-5 text-primary" />
                      Latest Career News
                    </h2>
                    
                    <Select
                      value={newsFilter}
                      onValueChange={setNewsFilter}
                    >
                      <SelectTrigger className="w-[180px] glass-input">
                        <SelectValue placeholder="All News" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All News</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts & Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredNews.map((news) => (
                      <Card key={news.id} className="hover:border-primary/40 transition-colors glass-panel">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground">
                              {news.tag.charAt(0).toUpperCase() + news.tag.slice(1)}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              {news.date}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{news.title}</CardTitle>
                          <CardDescription className="text-xs">Source: {news.source}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{news.snippet}</p>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" variant="outline" className="w-full">Read More</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </AnimatedTransition>
      </main>

      <Dialog open={isCareerDialogOpen} onOpenChange={setIsCareerDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glass-panel">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedCareer} Career Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about this career path
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedCareer && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Banknote className="h-4 w-4 text-primary" /> Salary Range
                    </h4>
                    <div className="glass-panel p-3 rounded-md">
                      <div className="text-sm mb-1">
                        <span className="font-medium">India:</span> {careerSalaryData[selectedCareer]?.india || defaultSalary.india}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Global:</span> {careerSalaryData[selectedCareer]?.global || defaultSalary.global}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <LineChart className="h-4 w-4 text-primary" /> Growth Projection
                    </h4>
                    <div className="glass-panel p-3 rounded-md">
                      <div className="text-sm">
                        <span className="font-medium">Next 5 Years:</span> 15-25% Growth
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Trend:</span> Increasing Demand
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-4 w-4 text-primary" /> Required Skills
                  </h4>
                  <div className="glass-panel p-3 rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {["Technical Knowledge", "Communication", "Problem Solving", "Team Collaboration", "Critical Thinking"].map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-accent">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" /> Work-Life Balance
                  </h4>
                  <div className="glass-panel p-3 rounded-md text-sm">
                    <div className="mb-1"><span className="font-medium">Average Hours:</span> 40-45 hours/week</div>
                    <div className="mb-1"><span className="font-medium">Remote Work:</span> Hybrid options available</div>
                    <div><span className="font-medium">Flexibility:</span> Moderate to High</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Building className="h-4 w-4 text-primary" /> Top Companies
                  </h4>
                  <div className="glass-panel p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="font-medium">India:</span> Infosys, TCS, Wipro
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Global:</span> Google, Microsoft, Amazon
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate(`/careers/${encodeURIComponent(selectedCareer)}?region=${selectedRegion}`)}
                >
                  <span>View Full Career Path</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareersPage;
