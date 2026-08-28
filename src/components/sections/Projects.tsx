import SectionIndex from "@/components/ui/SectionIndex";
import ProjectCard from "@/components/sections/ProjectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="work" className="above-field shell scroll-mt-32">
      <SectionIndex index="04" label="Selected Work" />

      <div className="mt-16">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
