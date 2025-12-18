import { useState } from 'react';
import { useGetAllLogs, useGetLogsByType } from '../hooks/useQueries';
import { EventCategory } from '../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Loader2, Search, Filter, Download } from 'lucide-react';
import { Card } from './ui/card';

const eventCategoryLabels: Record<EventCategory, string> = {
  [EventCategory.security]: 'Security',
  [EventCategory.access]: 'Access',
  [EventCategory.ca]: 'CA',
  [EventCategory.saml]: 'SAML',
  [EventCategory.ibe]: 'IBE',
  [EventCategory.systemAction]: 'System',
  [EventCategory.compliance]: 'Compliance',
};

const eventCategoryColors: Record<EventCategory, string> = {
  [EventCategory.security]: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  [EventCategory.access]: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  [EventCategory.ca]: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  [EventCategory.saml]: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  [EventCategory.ibe]: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  [EventCategory.systemAction]: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  [EventCategory.compliance]: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
};

export function SystemLogs() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  const { data: allLogs, isLoading: isLoadingAll } = useGetAllLogs();
  const { data: filteredLogs, isLoading: isLoadingFiltered } = useGetLogsByType(
    selectedCategory !== 'all' ? selectedCategory : EventCategory.security
  );

  const isLoading = selectedCategory === 'all' ? isLoadingAll : isLoadingFiltered;
  const logs = selectedCategory === 'all' ? allLogs : filteredLogs;

  // Filter logs by search query
  const searchFilteredLogs = logs?.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.user.toLowerCase().includes(searchLower) ||
      log.details.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Sort logs by timestamp (newest first)
  const sortedLogs = [...searchFilteredLogs].sort((a, b) => {
    return Number(b.timestamp - a.timestamp);
  });

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + logsPerPage);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Event Type', 'User', 'Action', 'Details'].join(','),
      ...sortedLogs.map((log) =>
        [
          formatTimestamp(log.timestamp),
          eventCategoryLabels[log.eventType],
          log.user,
          log.action,
          log.details,
        ]
          .map((field) => `"${field}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caibe-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value as EventCategory | 'all');
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value={EventCategory.security}>Security</SelectItem>
              <SelectItem value={EventCategory.access}>Access</SelectItem>
              <SelectItem value={EventCategory.ca}>CA</SelectItem>
              <SelectItem value={EventCategory.saml}>SAML</SelectItem>
              <SelectItem value={EventCategory.ibe}>IBE</SelectItem>
              <SelectItem value={EventCategory.systemAction}>System</SelectItem>
              <SelectItem value={EventCategory.compliance}>Compliance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={!logs || logs.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Logs Table */}
      <Card>
        <ScrollArea className="h-[600px]">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : paginatedLogs.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-medium">No logs found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[120px]">Event Type</TableHead>
                  <TableHead className="w-[120px]">User</TableHead>
                  <TableHead className="w-[200px]">Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log, index) => (
                  <TableRow key={`${log.timestamp}-${index}`}>
                    <TableCell className="font-mono text-xs">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={eventCategoryColors[log.eventType]}>
                        {eventCategoryLabels[log.eventType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, sortedLogs.length)} of{' '}
            {sortedLogs.length} logs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
