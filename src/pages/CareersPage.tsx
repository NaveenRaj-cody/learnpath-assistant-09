import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { careersData } from '@/data/careersData';
import { BriefcaseIcon, Globe, MapPin, Building, Search, Banknote, LineChart, Newspaper, Users, Calendar, ArrowUpRight } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import SearchableSelect from '@/components/SearchableSelect';
import { SubjectArea } from '@/types/filters';
import { findCareers } from '@/utils/dataUtils';

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

const CareersPage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<SubjectArea>('all');
  const [newsFilter, setNewsFilter] = useState('all');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);
  
  const careerOptions = React.useMemo(() => {
    return careersData.map(career => ({
      value: career.title,
      label: career.title
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, []);
  
  const filteredCareers = React.useMemo(() => {
    return findCareers(searchTerm, { field: selectedField });
  }, [searchTerm, selectedField]);
  
  const filteredNews = newsData.filter(news => 
    newsFilter === 'all' || news.tag === newsFilter
  );

  const handleViewCareerDetails = (careerTitle: string) => {
    setSelectedCareer(careerTitle);
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
    { value: 'business', label: 'Business/Management' },
    { value: 'arts', label: 'Arts & Design' },
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

  const selectedCareerData = selectedCareer ? careersData.find(career => career.title === selectedCareer) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        <AnimatedTransition>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gradient">Career Opportunities</h1>
          
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
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
                    <BriefcaseIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Career Opportunities {selectedRegion === 'india' ? 'in India' : 'Worldwide'}
                  </h2>
                  
                  {filteredCareers.length === 0 ? (
                    <Card className="p-8 text-center mb-6">
                      <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No careers found</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                      {filteredCareers.map((career) => (
                        <Card key={career.id} className="flex flex-col h-full hover:border-primary transition-colors glass-panel">
                          <CardHeader className="p-2 sm:p-6 pb-1 sm:pb-2">
                            <div className="flex justify-between items-start gap-1 sm:gap-2">
                              <CardTitle className="text-sm sm:text-lg line-clamp-2">{career.title}</CardTitle>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] sm:text-xs whitespace-nowrap">
                                {career.field}
                              </Badge>
                            </div>
                            <CardDescription className="text-[11px] sm:text-sm line-clamp-2">
                              {career.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-2 sm:p-6 pt-1 sm:pt-2 flex-grow">
                            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-sm">
                              <div className="flex items-center gap-1">
                                <Banknote className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                                <span className="line-clamp-1">{selectedRegion === 'india' ? career.salaryRange.india : career.salaryRange.global}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <LineChart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                                <span className="line-clamp-1">Growth: {career.growthRate}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                                <span className="line-clamp-1">{selectedRegion === 'india' ? 'Major Indian Cities' : 'Global Markets'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
                                <span className="line-clamp-1">Multiple Industries</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="mt-auto p-2 sm:p-6 pt-0">
                            <Button 
                              size="sm"
                              variant="outline" 
                              className="w-full text-[11px] sm:text-sm h-7 sm:h-9"
                              onClick={() => handleViewCareerDetails(career.title)}
                            >
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
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
        <DialogContent className="sm:max-w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto glass-panel">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedCareer} Career Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about this career path
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto">
            {selectedCareerData && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Banknote className="h-4 w-4 text-primary" /> Salary Range
                    </h4>
                    <div className="glass-panel p-3 rounded-md">
                      <div className="text-sm mb-1">
                        <span className="font-medium">India:</span> {selectedCareerData.salaryRange.india}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Global:</span> {selectedCareerData.salaryRange.global}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <LineChart className="h-4 w-4 text-primary" /> Growth Projection
                    </h4>
                    <div className="glass-panel p-3 rounded-md">
                      <div className="text-sm">
                        <span className="font-medium">Rate:</span> {selectedCareerData.growthRate}
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
                      {selectedCareerData.requiredSkills.map((skill, i) => (
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
                    <div className="mb-1"><span className="font-medium">Average Hours:</span> {selectedCareerData.workLifeBalance.averageHours}</div>
                    <div className="mb-1"><span className="font-medium">Remote Work:</span> {selectedCareerData.workLifeBalance.remoteWork}</div>
                    <div><span className="font-medium">Flexibility:</span> {selectedCareerData.workLifeBalance.flexibility}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Building className="h-4 w-4 text-primary" /> Top Companies
                  </h4>
                  <div className="glass-panel p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="font-medium">India:</span> {selectedCareerData.topCompanies.india.join(', ')}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Global:</span> {selectedCareerData.topCompanies.global.join(', ')}
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
