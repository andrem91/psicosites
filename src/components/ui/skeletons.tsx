import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton para cards do dashboard
 */
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <Skeleton className="h-9 w-full mt-4 rounded-lg" />
        </div>
    );
}

/**
 * Skeleton para listas de items (blog, FAQs, etc)
 */
export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
    );
}

/**
 * Skeleton para lista completa
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {Array.from({ length: count }).map((_, i) => (
                <ListItemSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Skeleton para tabela de estatísticas
 */
export function StatsSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-24" />
                </div>
            ))}
        </div>
    );
}

/**
 * Skeleton para formulário
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
    return (
        <div className="space-y-6">
            {Array.from({ length: fields }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            ))}
            <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
    );
}

/**
 * Skeleton para página inteira
 */
export function PageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
}

/**
 * Skeleton para perfil/avatar
 */
export function ProfileSkeleton() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    );
}
