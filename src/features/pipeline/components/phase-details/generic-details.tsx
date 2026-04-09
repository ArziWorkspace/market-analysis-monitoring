import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileJson } from "lucide-react"

interface GenericPhaseDetailsProps {
  details: Record<string, unknown>
}

export function GenericPhaseDetails({ details }: GenericPhaseDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FileJson className="size-4" />
          Phase Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          {JSON.stringify(details, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
