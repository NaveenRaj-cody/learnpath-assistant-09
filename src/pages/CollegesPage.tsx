import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Building, X, Medal, CheckSquare } from 'lucide-react';
import { coursesData } from '@/data/coursesData';
import { collegesData, College } from '@/data/collegesData';
import AnimatedTransition from '@/components/AnimatedTransition';
import CoursesModal from '@/components/CoursesModal';
import { useToast } from "@/hooks/use-toast";
import StarRating from '@/components/StarRating';
import { CollegeType, CollegeAffiliation, CollegeSpecialization, CollegeCredentials } from '@/types/filters';
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchableSelect from '@/components/SearchableSelect';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCollegesByIds } from '@/utils/dataUtils';

const statesData = [
  { name: "Andhra Pradesh", districts: ["Alluri Sitarama Raju", "Anakapalli", "Anantapur", "Annamaya", "Bapatla", "Chittoor", "East Godavari", "Eluru", "Guntur", "Kadapa", "Kakinada", "Konaseema", "Krishna", "Kurnool", "Manyam", "N T Rama Rao", "Nandyal", "Nellore", "Palnadu", "Prakasam", "Sri Balaji", "Sri Satya Sai", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari"] },
  { name: "Arunachal Pradesh", districts: ["Anjaw", "Bichom", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Keyi Panyor", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"] },
  { name: "Assam", districts: ["Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup Rural", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri", "West Karbi Anglong"] },
  { name: "Bihar", districts: ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"] },
  { name: "Chhattisgarh", districts: ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela Pendra Marwahi", "Janjgir Champa", "Jashpur", "Kabirdham", "Kanker", "Khairagarh", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh", "Mohla Manpur", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Sarangarh Bilaigarh", "Sukma", "Surajpur", "Surguja"] },
  { name: "Goa", districts: ["North Goa", "South Goa"] },
  { name: "Gujarat", districts: ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"] },
  { name: "Haryana", districts: ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"] },
  { name: "Himachal Pradesh", districts: ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"] },
  { name: "Jharkhand", districts: ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"] },
  { name: "Karnataka", districts: ["Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belgaum", "Bellary", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysore", "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"] },
  { name: "Kerala", districts: ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"] },
  { name: "Madhya Pradesh", districts: ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhau", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Mauganj", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Pandhurna", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"] },
  { name: "Maharashtra", districts: ["Ahmednagar", "Akola", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"] },
  { name: "Manipur", districts: ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"] },
  { name: "Meghalaya", districts: ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Mairang", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"] },
  { name: "Mizoram", districts: ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"] },
  { name: "Nagaland", districts: ["Chumukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"] },
  { name: "Odisha", districts: ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundergarh"] },
  { name: "Punjab", districts: ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"] },
  { name: "Rajasthan", districts: ["Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur", "Didwana Kuchaman", "Dudu", "Dungarpur", "Gangapur City", "Hanumangarh", "Jaipur", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Jodhpur Rural", "Karauli", "Kekri", "Khairthal Tijara", "Kota", "Kotputli Behror", "Nagaur", "Neem ka Thana", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"] },
  { name: "Sikkim", districts: ["East Sikkim", "North Sikkim", "Pakyong", "Soreng", "South Sikkim", "West Sikkim"] },
  { name: "Tamil Nadu", districts: ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"] },
  { name: "Telangana", districts: ["Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar", "Jogulamba", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"] },
  { name: "Tripura", districts: ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"] },
  { name: "Uttar Pradesh", districts: ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"] },
  { name: "Uttarakhand", districts: ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri", "Pithoragarh", "Rudraprayag", "Tehri", "Udham Singh Nagar", "Uttarkashi"] },
  { name: "West Bengal", districts: ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"] },
  { name: "Andaman and Nicobar Islands", districts: ["Nicobar", "North Middle Andaman", "South Andaman"] },
  { name: "Chandigarh", districts: ["Chandigarh"] },
  { name: "Dadra and Nagar Haveli and Daman and Diu", districts: ["Dadra and Nagar Haveli", "Daman", "Diu"] },
  { name: "Delhi", districts: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"] },
  { name: "Jammu and Kashmir", districts: ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"] },
  { name: "Ladakh", districts: ["Kargil", "Leh"] },
  { name: "Lakshadweep", districts: ["Lakshadweep"] },
  { name: "Puducherry", districts: ["Karaikal", "Mahe", "Puducherry", "Yanam"] }
];

const getCollegeRating = (collegeName: string): number => {
  const nameSum = collegeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 3 + (nameSum % 20) / 10;
};

const getCollegeCredentials = (college: College): CollegeCredentials => {
  const nameLength = college.name.length;
  const hasRanking = college.name.includes('Institute') || college.name.includes('University') || nameLength % 5 === 0;
  const isAccredited = college.name.includes('College') || college.name.includes('Institute') || nameLength % 3 === 0;
  
  return {
    ranking: hasRanking ? `Top ${nameLength % 50 + 1} in India` : undefined,
    accreditation: isAccredited ? 
      (nameLength % 4 === 0 ? 'A++ Grade (NAAC)' : 
       nameLength % 3 === 0 ? 'A+ Grade (NAAC)' : 
       nameLength % 2 === 0 ? 'A Grade (NAAC)' : 'B++ Grade (NAAC)') 
      : undefined,
    affiliation: college.name.includes('Institute') ? 'Autonomous Institution' : 
                (college.name.includes('University') ? 'University' : 
                 college.name.includes('Government') ? 'Government College' : 'Affiliated to State University')
  };
};

const CollegesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [collegeTypeFilter, setCollegeTypeFilter] = useState<CollegeType>('all');
  const [collegeAffiliationFilter, setCollegeAffiliationFilter] = useState<CollegeAffiliation>('all');
  const [specializationFilter, setSpecializationFilter] = useState<CollegeSpecialization>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [modalType, setModalType] = useState<'courses' | 'colleges'>('colleges');

  const uniqueColleges = collegesData;
  
  const collegeTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'engineering', label: 'Engineering Colleges' },
    { value: 'medical', label: 'Medical Colleges' },
    { value: 'dental', label: 'Dental Colleges' },
    { value: 'pharmacy', label: 'Pharmacy Colleges' },
    { value: 'law', label: 'Law Colleges' },
    { value: 'architecture', label: 'Architecture Colleges' },
    { value: 'management', label: 'Management Colleges' },
    { value: 'arts', label: 'Arts and Science Colleges' },
    { value: 'polytechnic', label: 'Polytechnic Colleges' },
    { value: 'education', label: 'Teacher Training Colleges' },
    { value: 'agricultural', label: 'Agricultural Colleges' },
    { value: 'veterinary', label: 'Veterinary Colleges' },
    { value: 'other', label: 'Other' }
  ];
  
  const collegeAffiliationOptions = [
    { value: 'all', label: 'All Affiliations' },
    { value: 'autonomous', label: 'Autonomous Colleges' },
    { value: 'affiliated', label: 'Non-Autonomous/Affiliated Colleges' },
    { value: 'government', label: 'Government Colleges' },
    { value: 'private', label: 'Private Colleges' },
    { value: 'deemed', label: 'Deemed-to-be Universities' },
    { value: 'central', label: 'Central University Colleges/Constituent Colleges' },
    { value: 'state', label: 'State University Colleges/Constituent Colleges' }
  ];
  
  const specializationOptions = [
    { value: 'all', label: 'All' },
    { value: 'women', label: 'Women\'s College' },
    { value: 'men', label: 'Men\'s College' },
    { value: 'coed', label: 'Co-education' }
  ];

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 1);
      
      const collegeMatches = uniqueColleges
        .filter(college => {
          const collegeName = college.name.toLowerCase();
          const collegeLocation = college.location.toLowerCase();
          
          return searchWords.every(word => 
            collegeName.includes(word) || collegeLocation.includes(word)
          );
        });
      
      const nameSuggestions = collegeMatches.map(college => college.name);
      const locationSuggestions = collegeMatches
        .map(college => college.location.split(',')[0].trim())
        .filter(location => location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const allSuggestions = [...new Set([...nameSuggestions, ...locationSuggestions])];
      setSearchSuggestions(allSuggestions.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm, uniqueColleges]);

  const stateOptions = useMemo(() => [
    { value: 'all', label: 'All States & UTs' },
    ...statesData.map(state => ({ value: state.name, label: state.name }))
  ], []);
  
  const availableDistricts = stateFilter === 'all' 
    ? [] 
    : statesData.find(state => state.name === stateFilter)?.districts || [];
    
  const districtOptions = useMemo(() => [
    { value: 'all', label: 'All Districts' },
    ...availableDistricts.map(district => ({ value: district, label: district }))
  ], [availableDistricts]);
  
  const filteredColleges = useMemo(() => {
    if (!searchTerm && collegeTypeFilter === 'all' && collegeAffiliationFilter === 'all' && 
        specializationFilter === 'all' && stateFilter === 'all') {
      return uniqueColleges;
    }
    
    return uniqueColleges.filter(college => {
      const matchesSearch = !searchTerm || searchTerm.split(/\s+/).every(term => {
        const termLower = term.toLowerCase();
        return college.name.toLowerCase().includes(termLower) || 
               college.location.toLowerCase().includes(termLower);
      });
      
      const matchesType = collegeTypeFilter === 'all' || 
        (collegeTypeFilter === 'engineering' && college.name.toLowerCase().includes('engineering')) ||
        (collegeTypeFilter === 'medical' && college.name.toLowerCase().includes('medical')) ||
        (collegeTypeFilter === 'dental' && college.name.toLowerCase().includes('dental')) ||
        (collegeTypeFilter === 'pharmacy' && college.name.toLowerCase().includes('pharmacy')) ||
        (collegeTypeFilter === 'law' && college.name.toLowerCase().includes('law')) ||
        (collegeTypeFilter === 'architecture' && college.name.toLowerCase().includes('architecture')) ||
        (collegeTypeFilter === 'management' && (college.name.toLowerCase().includes('management') || college.name.toLowerCase().includes('business'))) ||
        (collegeTypeFilter === 'arts' && (college.name.toLowerCase().includes('arts') || college.name.toLowerCase().includes('science'))) ||
        (collegeTypeFilter === 'polytechnic' && college.name.toLowerCase().includes('polytechnic')) ||
        (collegeTypeFilter === 'education' && (college.name.toLowerCase().includes('education') || college.name.toLowerCase().includes('teaching'))) ||
        (collegeTypeFilter === 'agricultural' && college.name.toLowerCase().includes('agriculture')) ||
        (collegeTypeFilter === 'veterinary' && college.name.toLowerCase().includes('veterinary')) ||
        (collegeTypeFilter === 'other' && !['engineering', 'medical', 'dental', 'pharmacy', 'law', 'architecture', 'management', 'arts', 'polytechnic', 'education', 'agricultural', 'veterinary'].some(
          type => college.name.toLowerCase().includes(type)
        ));
      
      const matchesAffiliation = collegeAffiliationFilter === 'all' || 
        (collegeAffiliationFilter === 'autonomous' && college.name.toLowerCase().includes('autonomous')) ||
        (collegeAffiliationFilter === 'affiliated' && (college.name.toLowerCase().includes('affiliated') || college.name.toLowerCase().includes('college'))) ||
        (collegeAffiliationFilter === 'government' && college.name.toLowerCase().includes('government')) ||
        (collegeAffiliationFilter === 'private' && !college.name.toLowerCase().includes('government')) ||
        (collegeAffiliationFilter === 'deemed' && college.name.toLowerCase().includes('deemed')) ||
        (collegeAffiliationFilter === 'central' && college.name.toLowerCase().includes('central')) ||
        (collegeAffiliationFilter === 'state' && college.name.toLowerCase().includes('state'));
      
      const matchesSpecialization = specializationFilter === 'all' || 
        (specializationFilter === 'women' && college.name.toLowerCase().includes('women')) ||
        (specializationFilter === 'men' && college.name.toLowerCase().includes('men')) ||
        (specializationFilter === 'coed' && !college.name.toLowerCase().includes('women') && !college.name.toLowerCase().includes('men'));
      
      const matchesState = stateFilter === 'all' || 
        college.location.includes(stateFilter);
      
      const matchesDistrict = districtFilter === 'all' || 
        college.location.includes(districtFilter);
      
      return matchesSearch && matchesType && matchesAffiliation && matchesSpecialization && matchesState && matchesDistrict;
    });
  }, [uniqueColleges, searchTerm, collegeTypeFilter, collegeAffiliationFilter, specializationFilter, stateFilter, districtFilter]);

  const handleViewDetails = (college: College) => {
    toast({
      title: "Viewing college details",
      description: `Loading details for ${college.name}`,
      duration: 2000,
    });
    navigate(`/colleges/${encodeURIComponent(college.name)}`);
  };

  const handleFilterChange = (type: string, value: string) => {
    toast({
      description: `Filter updated: ${type} set to ${value === 'all' ? 'All' : value}`,
      duration: 1500,
    });
    
    if (type === 'type') {
      setCollegeTypeFilter(value as CollegeType);
    } else if (type === 'affiliation') {
      setCollegeAffiliationFilter(value as CollegeAffiliation);
    } else if (type === 'specialization') {
      setSpecializationFilter(value as CollegeSpecialization);
    } else if (type === 'state') {
      setStateFilter(value);
      setDistrictFilter('all');
    } else if (type === 'district') {
      setDistrictFilter(value);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSearchSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <AnimatedTransition>
          <h1 className="text-3xl font-bold mb-8 text-gradient">Colleges</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <Card className="glass-panel hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">Filters</CardTitle>
                  <CardDescription>Refine your college search</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search colleges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 glass-input active:scale-[0.99] focus:scale-[1.01] transition-all hover:border-primary/50"
                      />
                      {searchTerm && (
                        <button 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() => setSearchTerm('')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {searchSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-border/50 max-h-60 overflow-y-auto">
                        <ul className="py-1">
                          {searchSuggestions.map((suggestion, index) => (
                            <li 
                              key={index} 
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">College Type</label>
                    <Select
                      value={collegeTypeFilter}
                      onValueChange={(value) => handleFilterChange('type', value)}
                    >
                      <SelectTrigger className={`w-full glass-input ${isMobile ? 'text-xs py-1' : ''}`}>
                        <SelectValue placeholder="Select college type" />
                      </SelectTrigger>
                      <SelectContent>
                        {collegeTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value} className={isMobile ? 'text-xs py-1' : ''}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">College Affiliation</label>
                    <Select
                      value={collegeAffiliationFilter}
                      onValueChange={(value) => handleFilterChange('affiliation', value)}
