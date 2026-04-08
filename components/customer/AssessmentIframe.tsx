"use client";

interface AssessmentIframeProps {
  slug: string;
}

export function AssessmentIframe({ slug }: AssessmentIframeProps) {
  return (
    <div className="h-screen w-full">
      <iframe
        src={`/api/assessments/proxy/${slug}`}
        className="w-full h-full border-0"
        title="Assessment"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
