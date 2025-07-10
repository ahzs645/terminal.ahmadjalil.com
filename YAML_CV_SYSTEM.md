# YAML-Driven CV System

This terminal portfolio now dynamically pulls CV data from the `Ahmad_Jalil_CV.yaml` file, making it easy to update your information without touching the code.

## How It Works

The system includes several components that work together:

### 1. CV Data Structure (`src/utils/cvData.ts`)
- **YAML Parsing**: Uses `js-yaml` to parse the CV YAML file
- **Type Safety**: Full TypeScript interfaces for all CV sections
- **Caching**: Loads data once and caches it for performance
- **Error Handling**: Fallback data if YAML fails to load

### 2. Dynamic Commands
The following commands now pull data directly from your YAML file:

- `cv` - Overview of all sections with counts
- `about` - Personal information (name, location)
- `education` - Education background with dates and highlights
- `experience` - Work experience with company details and achievements
- `volunteer` - Volunteer positions and contributions
- `awards` - Awards and achievements with descriptions
- `publications` - Published research papers with DOI links

### 3. Auto-scaling Sections
- **Add/Remove Items**: Simply edit the YAML file to add or remove entries
- **Terminal Style**: All content maintains the authentic terminal aesthetic
- **Responsive**: Automatically adjusts to new content length

## Updating Your CV

### To Add New Experience:
```yaml
cv:
  sections:
    experience:
      - company: New Company Name
        position: Your Position
        location: City, State
        start_date: 2024-01
        end_date: present
        show_date_in_position: true
        spacing_after: different_company
        highlights:
          - Achievement or responsibility
          - Another key accomplishment
```

### To Add New Education:
```yaml
cv:
  sections:
    education:
      - institution: University Name
        area: Field of Study
        degree: Degree Type
        location: City, State
        start_date: 2020-09
        end_date: 2024-05
        highlights:
          - Special honors or notes
```

### Date Formatting
The system automatically formats dates from `YYYY-MM` format to readable text:
- `2024-01` becomes "Jan 2024"
- `present` stays as "Present"

## File Structure

```
├── Ahmad_Jalil_CV.yaml          # Main CV data (edit this file)
├── public/Ahmad_Jalil_CV.yaml   # Copy for web access
├── src/
│   ├── utils/cvData.ts          # YAML parsing logic
│   └── components/commands/
│       ├── About.tsx            # Personal info
│       ├── CV.tsx              # Overview command
│       ├── Education.tsx        # Education section
│       ├── Experience.tsx       # Work experience
│       ├── Awards.tsx          # Awards section
│       ├── Publications.tsx     # Research papers
│       └── Volunteer.tsx        # Volunteer work
```

## Benefits

1. **Easy Updates**: Change CV data without touching React code
2. **Consistency**: Single source of truth for all CV information
3. **Type Safety**: Full TypeScript support prevents errors
4. **Terminal Aesthetic**: Maintains the authentic terminal look
5. **Performance**: Data is cached and loaded once
6. **Scalable**: Automatically handles any number of entries

## Development Notes

- The YAML file is copied to `public/` directory for web access
- Data is fetched at runtime and cached for performance
- Error handling provides fallback data if YAML fails to load
- All existing terminal functionality remains unchanged
