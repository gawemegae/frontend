import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Play, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoCardProps {
  video: { filename: string };
  onPreview: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function VideoCard({ video, onPreview, onRename, onDelete }: VideoCardProps) {
  const { t } = useTranslations();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Video thumbnail area */}
          <div 
            className="flex items-center justify-center h-24 sm:h-32 bg-gradient-to-br from-muted to-muted/50 rounded-lg cursor-pointer hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300"
            onClick={onPreview}
          >
            <Video className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </div>
          
          {/* Video info and actions */}
          <div className="space-y-2">
            <h3 
              className="font-medium text-xs sm:text-sm truncate cursor-pointer hover:text-blue-600 transition-colors" 
              title={video.filename}
              onClick={onPreview}
            >
              {video.filename}
            </h3>
            
            {/* Mobile: Dropdown menu, Desktop: Button row */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <MoreVertical className="h-3 w-3 mr-1" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={onPreview}>
                    <Play className="h-3 w-3 mr-2" />
                    {t('videos.preview')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onRename}>
                    <Edit className="h-3 w-3 mr-2" />
                    {t('videos.rename')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-3 w-3 mr-2" />
                    {t('videos.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop: Button row */}
            <div className="hidden sm:flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="outline"
                onClick={onPreview}
                className="flex-1 text-xs"
              >
                <Play className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onRename}
                className="flex-1 text-xs"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                className="flex-1 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}