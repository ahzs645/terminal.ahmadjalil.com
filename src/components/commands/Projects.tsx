import { useContext, useEffect, useState } from "react";
import {
  checkRedirect,
  getCurrentCmdArry,
  isArgInvalid,
} from "../../utils/funcs";
import {
  ProjectContainer,
  ProjectDesc,
  ProjectsIntro,
  ProjectTitle,
} from "../styles/Projects.styled";
import { Wrapper } from "../styles/Output.styled";
import { termContext } from "../Terminal";
import Usage from "../Usage";
import { getCVData, CVProject } from "../../utils/cvData";

const Projects: React.FC = () => {
  const { arg, history, rerender } = useContext(termContext);
  const [projects, setProjects] = useState<CVProject[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== get current command ===== */
  const currentCommand = getCurrentCmdArry(history);

  /* ===== Load CV data ===== */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const cvData = await getCVData();
        setProjects(cvData.cv.sections.projects);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  /* ===== check current command is redirect ===== */
  useEffect(() => {
    if (checkRedirect(rerender, currentCommand, "projects")) {
      projects.forEach((project, index) => {
        const projectIndex = index + 1;
        if (projectIndex === parseInt(arg[1]) && project.url) {
          window.open(project.url, "_blank");
        }
      });
    }
  }, [arg, rerender, currentCommand, projects]);

  /* ===== check arg is valid ===== */
  const checkArg = () => {
    const validArgs = projects && projects.length > 0 ? projects.map((_, index) => (index + 1).toString()) : [];
    return isArgInvalid(arg, "go", validArgs) ? (
      <Usage cmd="projects" />
    ) : null;
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <Wrapper data-testid="projects">
      <ProjectsIntro>
        "Talk is cheap. Show me the code"? I got you. <br />
        Here are some of my projects you shouldn't miss
      </ProjectsIntro>
      {projects && projects.length > 0 ? projects.map((project, index) => (
        <ProjectContainer key={index}>
          <ProjectTitle>{`${index + 1}. ${project.name}`}</ProjectTitle>
          <ProjectDesc>
            {project.summary}
          </ProjectDesc>
        </ProjectContainer>
      )) : (
        <div>No projects found.</div>
      )}
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Use 'projects go &lt;project-no&gt;' to view project details or visit project link.
      </div>
    </Wrapper>
  );
};

export default Projects;
