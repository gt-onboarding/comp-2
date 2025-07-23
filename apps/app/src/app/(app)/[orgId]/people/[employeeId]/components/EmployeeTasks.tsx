import type { TrainingVideo } from '@/lib/data/training-videos';
import type { EmployeeTrainingVideoCompletion, Member, Policy, User } from '@comp/db/types';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@comp/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@comp/ui/tabs';
import { T, Var, DateTime } from 'gt-next';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { FleetPolicy, Host } from '../../devices/types';

export const EmployeeTasks = ({
  employee,
  policies,
  trainingVideos,
  host,
  fleetPolicies,
  isFleetEnabled,
}: {
  employee: Member & {
    user: User;
  };
  policies: Policy[];
  trainingVideos: (EmployeeTrainingVideoCompletion & {
    metadata: TrainingVideo;
  })[];
  host: Host;
  fleetPolicies: FleetPolicy[];
  isFleetEnabled: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col items-start justify-between gap-4 text-base sm:flex-row sm:items-center">
          <div>
            <T><h2 className="text-lg font-medium">Employee Tasks</h2></T>
            <T>
              <h3 className="text-muted-foreground text-sm">
                View and manage employee tasks and their status
              </h3>
            </T>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="policies">
          <TabsList className="mb-4">
            <T><TabsTrigger value="policies">Policies</TabsTrigger></T>
            <T><TabsTrigger value="training">Training Videos</TabsTrigger></T>
            {isFleetEnabled && <T><TabsTrigger value="device">Device</TabsTrigger></T>}
          </TabsList>

          <TabsContent value="policies">
            <div className="flex flex-col gap-2">
              {policies.length === 0 ? (
                <T>
                  <div className="text-muted-foreground py-6 text-center">
                    <p>No policies required to sign.</p>
                  </div>
                </T>
              ) : (
                policies.map((policy) => {
                  const isCompleted = policy.signedBy.includes(employee.id);

                  return (
                    <div
                      key={policy.id}
                      className="flex items-center justify-between gap-2 border p-3"
                    >
                      <h2 className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        {policy.name}
                      </h2>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="training">
            <div className="flex flex-col gap-2">
              {trainingVideos.length === 0 ? (
                <T>
                  <div className="text-muted-foreground py-6 text-center">
                    <p>No training videos required to watch.</p>
                  </div>
                </T>
              ) : (
                trainingVideos.map((video) => {
                  const isCompleted = video.completedAt !== null;

                  return (
                    <div
                      key={video.id}
                      className="flex items-center justify-between gap-2 border p-3"
                    >
                      <h2 className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          {video.metadata.title}
                        </div>
                        {isCompleted && (
                          <T>
                            <span className="text-muted-foreground self-start text-xs">
                              Completed -{' '}
                              <Var>{video.completedAt && <DateTime>{new Date(video.completedAt)}</DateTime>}</Var>
                            </span>
                          </T>
                        )}
                      </h2>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {isFleetEnabled && (
            <TabsContent value="device">
              {host ? (
                <Card>
                  <CardHeader>
                    <T><CardTitle><Var>{host.computer_name}</Var>'s Policies</CardTitle></T>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {fleetPolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className={cn(
                          'hover:bg-muted/50 flex items-center justify-between rounded-md border border-l-4 p-3 shadow-sm transition-colors',
                          policy.response === 'pass' ? 'border-l-green-500' : 'border-l-red-500',
                        )}
                      >
                        <p className="font-medium">{policy.name}</p>
                        {policy.response === 'pass' ? (
                          <T>
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 size={16} />
                              <span>Pass</span>
                            </div>
                          </T>
                        ) : (
                          <T>
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle size={16} />
                              <span>Fail</span>
                            </div>
                          </T>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <T>
                  <div className="text-muted-foreground py-6 text-center">
                    <p>No device found.</p>
                  </div>
                </T>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
